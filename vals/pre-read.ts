import Anthropic from "npm:@anthropic-ai/sdk";
import lunr from "https://cdn.skypack.dev/lunr";
import { marked } from "npm:marked";

const anthropic = new Anthropic();
const MODEL = "claude-sonnet-4-6";
const SITE_URL = "https://www.joshbeckman.org";
const MAX_TOOL_ROUNDS = 6;
const JINA_BASE = "https://r.jina.ai/";

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
  let results = index.search(input);

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
      const seen = new Set(results.map((r) => r.ref));
      for (const r of orResults) {
        if (!seen.has(r.ref)) {
          seen.add(r.ref);
          results.push(r);
        }
      }
    }
  }

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
      max_tokens: 2048,
      system: systemPrompt,
      tools,
      messages,
    });

    const textBlocks = response.content.filter((b) => b.type === "text");
    const toolBlocks = response.content.filter((b) => b.type === "tool_use");

    if (toolBlocks.length === 0) {
      const rawText = textBlocks.map((b) => b.text).join("\n");
      const cleaned = extractComment(rawText);
      return { text: cleaned, toolCalls: allToolCalls };
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    for (const block of toolBlocks) {
      allToolCalls.push({ name: block.name, input: block.input as Record<string, unknown> });
      const result = await executeTool(block.name, block.input as Record<string, unknown>);
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }
    messages.push({ role: "user", content: toolResults });
  }

  messages.push({
    role: "user",
    content: "You've done enough research. Based on what you've found so far, write your response now. Restate the claim you're responding to, then give your perspective. Output ONLY the response with markdown links — nothing else.",
  });
  const finalResponse = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });
  const rawText = finalResponse.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  const cleaned = extractComment(rawText);
  return { text: cleaned, toolCalls: allToolCalls };
}

function extractComment(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const paragraphs = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const withLinks = paragraphs.filter((p) => p.includes("]("));

  if (withLinks.length > 0) {
    return withLinks.join("\n\n");
  }

  return paragraphs[paragraphs.length - 1] || trimmed;
}

async function fetchPageContent(url: string): Promise<{ title: string; content: string }> {
  const jinaKey = Deno.env.get("JINA_AI_API_KEY");
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (jinaKey) {
    headers["Authorization"] = `Bearer ${jinaKey}`;
  }
  const resp = await fetch(`${JINA_BASE}${url}`, { headers });
  if (!resp.ok) {
    throw new Error(`Failed to fetch page: ${resp.status} ${resp.statusText}`);
  }
  const data = await resp.json();
  return {
    title: data.data?.title || url,
    content: data.data?.content || "",
  };
}

export default async function (req: Request): Promise<Response> {
  _searchData = null;
  _index = null;
  _tags = null;
  _toneGuide = null;

  const params = new URL(req.url).searchParams;
  const pageUrl = params.get("url");
  if (!pageUrl) {
    return new Response(JSON.stringify({ error: "url parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const page = await fetchPageContent(pageUrl);
  if (!page.content) {
    return new Response(JSON.stringify({ error: "Could not fetch page content", url: pageUrl }), {
      status: 422,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const domain = new URL(pageUrl).hostname.replace(/^www\./, "");
  const pageSummary = `Title: ${page.title}\nURL: ${pageUrl}\nDomain: ${domain}\n\nContent:\n${page.content.slice(0, 8000)}`;
  const toneGuide = await getToneGuide();

  const systemPrompt = `You are helping pre-read a web page through the lens of a personal knowledge garden at joshbeckman.org. You have access to tools that let you search and read posts in the garden.

Your job: given a web page someone is about to read, research the garden to find related prior writing, then write a response that frames what the garden's author already knows or has written about in relation to this piece.

Strategy:
1. Read the page and identify its core themes, arguments, the author's name, and the source domain
2. Search the garden for prior content from this author and domain — many notes in the garden are highlights from other sources, so searching by author name or domain often finds previously saved material
3. Search for related posts by key concepts, themes, and adjacent ideas
4. Read any promising posts in full if the search snippets aren't enough
5. Write your response: restate the claim or argument you're responding to, then connect it to the garden's prior writing

Your response should:
- Be written in first person as the garden's author
- Restate the key claim or argument from the page that you're addressing
- Draw specific connections or contrasts to posts you found, linking them by title
- Help the reader understand what they already know about this topic before diving in
- Be a short paragraph or two — enough to restate the claim and give your perspective
- Use markdown links like [Title](URL) when referencing posts

Follow this writing style guide for tone and voice:

${toneGuide}

CRITICAL FORMAT RULE: Your final response (after you finish using tools) must contain ONLY the response itself. Nothing else. No "Here is my response", no "I found that", no numbered lists, no reasoning, no summary of research. Just the response.`;

  const angles: Record<string, string> = {
    proponent:
      "Your angle: PROPONENT. Find where the garden's prior writing supports, extends, or reinforces the ideas in this page. Show what existing knowledge aligns with or builds toward these ideas.",
    opponent:
      "Your angle: OPPONENT. Find where the garden's prior writing pushes back on, complicates, or contradicts the ideas in this page. Identify tensions between what the author already believes and what this piece argues.",
    questioner:
      "Your angle: QUESTIONER. Find what the garden's prior writing leaves open or unresolved in relation to this page. What questions does the author's existing knowledge raise about this new piece?",
  };

  const [proResult, oppResult, queResult] = await Promise.all(
    ["proponent", "opponent", "questioner"].map((perspective) =>
      agentLoop(systemPrompt, `${angles[perspective]}\n\nHere is the web page to pre-read:\n\n${pageSummary}`)
    )
  );

  const [proponentHtml, opponentHtml, questionerHtml] = await Promise.all([
    marked.parse(proResult.text),
    marked.parse(oppResult.text),
    marked.parse(queResult.text),
  ]);

  const allToolCalls = [...proResult.toolCalls, ...oppResult.toolCalls, ...queResult.toolCalls];
  const searchQueries = allToolCalls
    .filter((tc) => tc.name === "search_posts")
    .map((tc) => tc.input.query as string);

  return new Response(
    JSON.stringify({
      page: { title: page.title, url: pageUrl },
      queries: [...new Set(searchQueries)],
      perspectives: {
        proponent: { markdown: proResult.text, html: proponentHtml },
        opponent: { markdown: oppResult.text, html: opponentHtml },
        questioner: { markdown: queResult.text, html: questionerHtml },
      },
    }),
    { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
  );
}
