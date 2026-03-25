import Anthropic from "npm:@anthropic-ai/sdk";
import lunr from "https://cdn.skypack.dev/lunr";
import { marked } from "npm:marked";

const anthropic = new Anthropic();
const MODEL = "claude-sonnet-4-6";
const SITE_URL = "https://www.joshbeckman.org";
const MAX_TOOL_ROUNDS = 6;

type Post = {
  doc: string;
  title: string;
  content: string;
  tags: string;
  url: string;
  type: string;
  date: string;
  backlinks?: string[];
  sequences?: Array<{ id: string; topic: string }>;
  author_id?: string;
  book?: number | string;
  image?: string;
};

// Tools exposed to the agent, mirroring the MCP server's capabilities
const tools: Anthropic.Messages.Tool[] = [
  {
    name: "search_posts",
    description:
      "Search for posts in the knowledge garden by query text. This is a keyword-based search (like Elasticsearch), NOT semantic/embedding search. Use short queries with specific nouns and terms that would literally appear in post text. For example: 'domain events CRUD' not 'how domain events prevent CRUD-shaped thinking'. Try multiple focused queries rather than one complex one. Use the tag filter when you know a relevant tag. Returns titles, URLs, tags, and content snippets.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query text" },
        limit: { type: "number", description: "Max results (1-10, default 5)" },
        tag: { type: "string", description: "Filter to posts with this tag" },
        category: {
          type: "string",
          enum: ["blog", "notes", "exercise", "replies", "page"],
          description: "Filter by post category",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_post",
    description:
      "Get the full content and metadata of a specific post by its URL path (e.g. /notes/446271384). Use this to read a post in full when you need more context than the search snippet provides.",
    input_schema: {
      type: "object" as const,
      properties: {
        url: { type: "string", description: "Post URL or path" },
      },
      required: ["url"],
    },
  },
  {
    name: "get_tags",
    description:
      "List all tags used in the knowledge garden. Useful for discovering what themes exist.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "search_tags",
    description:
      "Search for tags matching a query string. Returns matching tag names.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Tag name to search for" },
      },
      required: ["query"],
    },
  },
];

// Data cache — loaded once per request
let _searchData: Record<string, Post> | null = null;
let _index: lunr.Index | null = null;
let _tags: Array<{ name: string; url: string }> | null = null;
let _toneGuide: string | null = null;

async function getSearchData(): Promise<Record<string, Post>> {
  if (!_searchData) {
    _searchData = await fetch(`${SITE_URL}/assets/js/SearchData.json`).then((r) => r.json());
  }
  return _searchData!;
}

async function getIndex(): Promise<lunr.Index> {
  if (!_index) {
    const searchData = await getSearchData();
    lunr.tokenizer.separator = /[\s/]+/;
    _index = lunr(function () {
      this.ref("id");
      this.field("title");
      this.field("content");
      this.field("url");
      this.field("tags");
      this.metadataWhitelist = ["position"];
      for (const i in searchData) {
        this.add({
          id: i,
          title: searchData[i].title,
          content: searchData[i].content,
          url: searchData[i].url,
          tags: searchData[i].tags,
        });
      }
    });
  }
  return _index!;
}

async function getTags(): Promise<Array<{ name: string; url: string }>> {
  if (!_tags) {
    _tags = await fetch(`${SITE_URL}/assets/js/tags.json`).then((r) => r.json());
  }
  return _tags!;
}

async function getToneGuide(): Promise<string> {
  if (!_toneGuide) {
    _toneGuide = await fetch(`${SITE_URL}/llms/prompts/tone.txt`).then((r) => r.text());
  }
  return _toneGuide!;
}

function postFilter(post: Post) {
  return post.type === "post" || post.type === "page";
}

function extractCategory(post: Post): string {
  if (post.type === "page") return "page";
  if (post.url?.includes("/notes/")) return "notes";
  if (post.url?.includes("/exercise/")) return "exercise";
  if (post.url?.includes("/replies/")) return "replies";
  return "blog";
}

function formatPost(post: Post): string {
  const url = post.url?.startsWith("http") ? post.url : SITE_URL + post.url;
  return [
    `# [${post.title}](${url})`,
    "",
    post.content?.slice(0, 1000),
    "",
    `- tags: ${(post.tags || "").split(" ").join(", ")}`,
    `- date: ${post.date}`,
    `- category: ${extractCategory(post)}`,
    post.backlinks?.length ? `- backlinks: ${post.backlinks.map((b) => SITE_URL + b).join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function search(input: string, index: lunr.Index, searchData: Record<string, Post>) {
  // Try default AND search first
  let results = index.search(input);

  // If AND returned few results, try OR so any matching term scores
  if (results.length < 3 && input.length > 2) {
    const tokens = lunr.tokenizer(input).filter((t: lunr.Token) => t.str.length < 20);
    if (tokens.length > 1) {
      const orResults = index.query((q: lunr.Query) => {
        for (const token of tokens) {
          q.term(token.str, {
            fields: ["title", "tags"],
            boost: 10,
            presence: lunr.Query.presence.OPTIONAL,
          });
          q.term(token.str, {
            fields: ["content"],
            presence: lunr.Query.presence.OPTIONAL,
          });
        }
      });
      // Merge: keep AND results first (higher relevance), then add OR results
      const seen = new Set(results.map((r) => r.ref));
      for (const r of orResults) {
        if (!seen.has(r.ref)) {
          seen.add(r.ref);
          results.push(r);
        }
      }
    }
  }

  // Fuzzy fallback for typos/stemming mismatches
  if (results.length === 0 && input.length > 2) {
    const tokens = lunr.tokenizer(input).filter((t: lunr.Token) => t.str.length < 20);
    if (tokens.length > 0) {
      results = index.query((q: lunr.Query) => {
        q.term(tokens, { editDistance: Math.round(Math.sqrt(input.length / 2 - 1)) });
      });
    }
  }

  return results
    .map((r) => searchData[r.ref])
    .filter((p) => p && postFilter(p));
}

// Execute a tool call and return the result text
async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const searchData = await getSearchData();
  const index = await getIndex();

  if (name === "search_posts") {
    const query = input.query as string;
    const limit = Math.min(Math.max((input.limit as number) || 5, 1), 10);
    let results = search(query, index, searchData);
    if (input.tag) results = results.filter((p) => p.tags?.includes(input.tag as string));
    if (input.category) results = results.filter((p) => extractCategory(p) === input.category);
    if (results.length === 0) return `No posts found for "${query}".`;
    return results
      .slice(0, limit)
      .map((p) => formatPost(p))
      .join("\n\n---\n\n");
  }

  if (name === "get_post") {
    const url = input.url as string;
    const db = Object.values(searchData).filter(postFilter);
    const post = db.find((p) => p.url === url || SITE_URL + p.url === url);
    if (!post) return `Post "${url}" not found.`;
    return formatPost(post);
  }

  if (name === "get_tags") {
    const tags = await getTags();
    return tags.map((t) => t.name).sort().join(", ");
  }

  if (name === "search_tags") {
    const q = (input.query as string).toLowerCase();
    const tags = await getTags();
    const matches = tags.filter((t) => t.name.toLowerCase().includes(q));
    if (matches.length === 0) return `No tags matching "${q}".`;
    return matches.slice(0, 20).map((t) => t.name).join(", ");
  }

  return `Unknown tool: ${name}`;
}

// Run an agentic tool-use loop until Claude produces a final text response
async function agentLoop(
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; toolCalls: Array<{ name: string; input: Record<string, unknown> }> }> {
  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: userMessage },
  ];
  const allToolCalls: Array<{ name: string; input: Record<string, unknown> }> = [];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    });

    // Collect any text and tool_use blocks
    const textBlocks = response.content.filter((b) => b.type === "text");
    const toolBlocks = response.content.filter((b) => b.type === "tool_use");

    if (toolBlocks.length === 0) {
      // No more tool calls — extract just the comment from the response
      const rawText = textBlocks.map((b) => b.text).join("\n");
      const cleaned = await extractComment(rawText);
      return { text: cleaned, toolCalls: allToolCalls };
    }

    // Add assistant response to messages
    messages.push({ role: "assistant", content: response.content });

    // Execute all tool calls and add results
    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    for (const block of toolBlocks) {
      allToolCalls.push({ name: block.name, input: block.input as Record<string, unknown> });
      const result = await executeTool(block.name, block.input as Record<string, unknown>);
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }
    messages.push({ role: "user", content: toolResults });
  }

  // Exceeded max rounds — force a final comment with an explicit instruction
  messages.push({
    role: "user",
    content: "You've done enough research. Based on what you've found so far, write your 1-2 sentence comment now. Output ONLY the comment with markdown links — nothing else.",
  });
  const finalResponse = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: systemPrompt,
    messages,
  });
  const rawText = finalResponse.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  const cleaned = await extractComment(rawText);
  return { text: cleaned, toolCalls: allToolCalls };
}

// The agent often includes reasoning paragraphs before the actual comment.
// Extract the longest paragraph containing markdown links — that's the comment.
function extractComment(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  // Split into paragraphs (separated by blank lines)
  const paragraphs = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  // Find paragraphs that contain markdown links
  const withLinks = paragraphs.filter((p) => p.includes("]("));

  if (withLinks.length > 0) {
    // Return the longest paragraph with links — that's the substantive comment
    return withLinks.reduce((a, b) => (a.length >= b.length ? a : b));
  }

  // No links found — return the last paragraph as best guess
  return paragraphs[paragraphs.length - 1] || trimmed;
}

export default async function (req: Request): Promise<Response> {
  // Reset per-request cache
  _searchData = null;
  _index = null;
  _tags = null;
  _toneGuide = null;

  const params = new URL(req.url).searchParams;
  const postUrl = params.get("post");
  if (!postUrl) {
    return new Response(JSON.stringify({ error: "post parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const postPath = postUrl.startsWith("http") ? new URL(postUrl).pathname : postUrl;
  const searchData = await getSearchData();
  const post = (Object.values(searchData) as Post[]).find((p) => p.url === postPath);
  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found", postUrl }), {
      status: 404,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const postFullUrl = SITE_URL + post.url;
  const postSummary = `Title: ${post.title}\nURL: ${postFullUrl}\nTags: ${post.tags}\n\nContent:\n${post.content}`;
  const toneGuide = await getToneGuide();

  const systemPrompt = `You are helping annotate a personal knowledge garden at joshbeckman.org. You have access to tools that let you search and read posts in the garden.

Your job: given a post, research the garden to find related ideas, then write a 1-2 sentence original comment from a specific perspective.

Strategy:
1. Read the post and understand its core idea
2. Search for related, contrasting, and adjacent posts using multiple queries — try different angles, not just the obvious keywords
3. Read any promising posts in full if the search snippets aren't enough
4. Write your comment with markdown links to the specific related posts you found

Your comment should:
- Be written in first person as the garden's author
- Draw specific connections or contrasts to posts you found, linking them by title
- Add genuine intellectual value, not just summarize
- Be concise and direct (1-2 sentences)
- Use markdown links like [Title](URL) when referencing posts

Follow this writing style guide for tone and voice:

${toneGuide}

CRITICAL FORMAT RULE: Your final response (after you finish using tools) must contain ONLY the 1-2 sentence comment. Nothing else. No "Here is my comment", no "I found that", no numbered lists, no reasoning, no summary of research. Just the comment itself — as if you are typing it directly into the post file.`;

  const angles: Record<string, string> = {
    proponent:
      "Your angle: PROPONENT. Build on and extend the idea. Connect it to supporting evidence from the related posts. Show where this principle has proven true or reinforces other ideas in the garden.",
    opponent:
      "Your angle: OPPONENT. Push back on or complicate the idea. Identify tensions, exceptions, or counterexamples. Where does this break down or conflict with other ideas in the garden?",
    questioner:
      "Your angle: QUESTIONER. Open up the idea. Ask what follows from it, what it implies, or what it leaves unanswered. Frame a question worth sitting with, grounded in what you found in the garden.",
  };

  // Run all three perspectives in parallel, each with its own agentic loop
  const [proResult, oppResult, queResult] = await Promise.all(
    ["proponent", "opponent", "questioner"].map((perspective) =>
      agentLoop(systemPrompt, `${angles[perspective]}\n\nHere is the post to comment on:\n\n${postSummary}`)
    )
  );

  const [proponentHtml, opponentHtml, questionerHtml] = await Promise.all([
    marked.parse(proResult.text),
    marked.parse(oppResult.text),
    marked.parse(queResult.text),
  ]);

  // Collect all unique related posts referenced across tool calls
  const allToolCalls = [...proResult.toolCalls, ...oppResult.toolCalls, ...queResult.toolCalls];
  const searchQueries = allToolCalls
    .filter((tc) => tc.name === "search_posts")
    .map((tc) => tc.input.query as string);

  return new Response(
    JSON.stringify({
      post: { title: post.title, url: postFullUrl, tags: post.tags, contentHtml: await marked.parse(post.content || "") },
      queries: [...new Set(searchQueries)],
      suggestions: {
        proponent: { markdown: proResult.text, html: proponentHtml },
        opponent: { markdown: oppResult.text, html: opponentHtml },
        questioner: { markdown: queResult.text, html: questionerHtml },
      },
    }),
    { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
  );
}
