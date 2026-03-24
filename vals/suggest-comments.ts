import Anthropic from "npm:@anthropic-ai/sdk";
import lunr from "https://cdn.skypack.dev/lunr";
import { marked } from "npm:marked";

const anthropic = new Anthropic();
const MODEL = "claude-haiku-4-5-20251001";

type Post = {
  doc: string;
  title: string;
  content: string;
  tags: string;
  url: string;
  type: string;
  date: string;
};

type SearchResult = {
  title: string;
  content: string;
  url: string;
  tags: string;
  score: number;
};

export default async function (req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  let postUrl = params.get("post");
  if (!postUrl) {
    return new Response(JSON.stringify({ error: "post parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const postPath = new URL(postUrl).pathname;
  const searchData = await fetch(
    "https://www.joshbeckman.org/assets/js/SearchData.json"
  ).then((res) => res.json());
  const index = buildIndex(searchData);

  const post = (Object.values(searchData) as Post[]).find(
    (p) => p.url === postPath
  );
  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found", postUrl }), {
      status: 404,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  // Search strategy: keyword search from tags + LLM-generated queries, then deduplicate
  const tagKeywords = (post.tags || "").replace(/-/g, " ");
  const [llmQueries] = await Promise.all([generateSearchQueries(post)]);

  const allQueries = [tagKeywords, ...llmQueries].filter(Boolean);
  const allResults: SearchResult[] = [];
  const seenUrls = new Set<string>();
  // Always exclude the post itself
  seenUrls.add("https://www.joshbeckman.org" + post.url);

  for (const query of allQueries) {
    const results = search(query, index, searchData).filter(postFilter);
    for (const result of results) {
      if (!seenUrls.has(result.url)) {
        seenUrls.add(result.url);
        allResults.push(result);
      }
    }
  }

  const topResults = allResults.slice(0, 10);

  if (topResults.length === 0) {
    return new Response(
      JSON.stringify({ error: "No related posts found", post: { title: post.title, url: post.url } }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  const context = topResults
    .map((r) => `# [${r.title}](${r.url})\n\n${r.content}`)
    .join("\n\n");

  const relatedLinks = topResults
    .map((r) => `- "${r.title}" -> ${r.url}`)
    .join("\n");

  // Generate all three perspectives in parallel
  const [proponent, opponent, questioner] = await Promise.all([
    generateComment("proponent", post, context, relatedLinks),
    generateComment("opponent", post, context, relatedLinks),
    generateComment("questioner", post, context, relatedLinks),
  ]);

  const proponentHtml = await marked.parse(proponent);
  const opponentHtml = await marked.parse(opponent);
  const questionerHtml = await marked.parse(questioner);

  return new Response(
    JSON.stringify({
      post: { title: post.title, url: "https://www.joshbeckman.org" + post.url, tags: post.tags },
      queries: allQueries,
      relatedPosts: topResults.map((r) => ({ title: r.title, url: r.url })),
      suggestions: {
        proponent: { markdown: proponent, html: proponentHtml },
        opponent: { markdown: opponent, html: opponentHtml },
        questioner: { markdown: questioner, html: questionerHtml },
      },
    }),
    { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
  );
}

async function generateSearchQueries(post: Post): Promise<string[]> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 150,
    messages: [
      {
        role: "user",
        content: `Given this post from a knowledge garden, generate exactly 3 short search queries (one per line) that would find related, contrasting, or adjacent ideas in the same collection. Think about what concepts this connects to, what it argues against, and what it implies.

Title: ${post.title}
Tags: ${post.tags}
Content: ${post.content.slice(0, 500)}

Reply with exactly 3 queries, one per line, no numbering or bullets.`,
      },
    ],
  });
  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return text.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 3);
}

async function generateComment(
  perspective: "proponent" | "opponent" | "questioner",
  post: Post,
  context: string,
  relatedLinks: string
): Promise<string> {
  const angles: Record<string, string> = {
    proponent:
      "PROPONENT. Build on and extend the idea. Connect it to supporting evidence from the related posts. Show where this principle has proven true or where it reinforces other ideas.",
    opponent:
      "OPPONENT. Push back on or complicate the idea. Identify tensions, exceptions, or counterexamples from the related posts. Where does this principle break down or conflict with other ideas?",
    questioner:
      "QUESTIONER. Open up the idea rather than close it down. Ask what follows from it, what it implies, or what it leaves unanswered. Use the related posts to frame a question worth sitting with.",
  };

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `You are helping annotate a personal knowledge garden. The following is a post that needs commentary:

--- Post: ${post.title} ---
${post.content}

Here are related posts from the same knowledge garden:
${context}

When referencing a related post, use a markdown link with its URL. Available links:
${relatedLinks}

Your angle: ${angles[perspective]}

Write 1-2 sentences of original commentary. The comment should:
- Be written in first person as the garden's author
- Draw a specific connection or contrast to ideas in the related posts, linking to them by name
- Add genuine intellectual value, not just summarize
- Be concise and direct
- Use markdown links when mentioning related posts

Output ONLY the comment text (with markdown links), nothing else.`,
      },
    ],
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

function postFilter(post: { title?: string; type?: string }) {
  return !post.title?.includes("(tag)");
}

function buildIndex(searchData: Record<string, Post>) {
  lunr.tokenizer.separator = /[\s/]+/;
  return lunr(function () {
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

function search(input: string, index: lunr.Index, searchData: Record<string, Post>): SearchResult[] {
  let results = index.search(input);

  if (results.length === 0 && input.length > 2) {
    const tokens = lunr.tokenizer(input).filter((token: lunr.Token) => token.str.length < 20);
    if (tokens.length > 0) {
      results = index.query((query: lunr.Query) => {
        query.term(tokens, {
          editDistance: Math.round(Math.sqrt(input.length / 2 - 1)),
        });
      });
    }
  }

  return results.map((result) => {
    const item = searchData[result.ref];
    return {
      title: item.title,
      content: item.content,
      tags: item.tags,
      url: "https://www.joshbeckman.org" + item.url,
      score: result.score,
    };
  });
}
