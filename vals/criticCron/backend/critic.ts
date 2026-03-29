import Anthropic from "npm:@anthropic-ai/sdk";
import { blob } from "https://esm.town/v/std/blob";
import { email } from "https://esm.town/v/std/email";
import { marked } from "npm:marked";
import { executeTool, tools, getSearchData, formatPost, type Post } from "./search.ts";

const anthropic = new Anthropic();
const RESEARCH_MODEL = "claude-sonnet-4-20250514";
const CRITIQUE_MODEL = "claude-opus-4-6";
const SITE_URL = "https://www.joshbeckman.org";
const FEED_URL = `${SITE_URL}/feed.xml`;
const JINA_BASE = "https://r.jina.ai/";
const MAX_TOOL_ROUNDS = 8;
const BLOB_KEY = "critic_cron_processed_urls";
const CUTOFF_DATE = "2026-03-28";

type FeedEntry = {
  title: string;
  url: string;
  published: string;
  updated: string;
  content: string;
  categories: string[];
};

// --- Feed parsing ---

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";
  return match[1] ?? match[2] ?? "";
}

function extractLink(xml: string): string {
  // Atom <link> can have href before or after rel="alternate"
  const match = xml.match(/<link[^>]+href="([^"]+)"[^>]*rel="alternate"/);
  if (match) return match[1];
  const match2 = xml.match(/<link[^>]+rel="alternate"[^>]+href="([^"]+)"/);
  return match2 ? match2[1] : "";
}

function extractCategories(xml: string): string[] {
  const matches = [...xml.matchAll(/<category[^>]+term="([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

export async function parseFeed(): Promise<FeedEntry[]> {
  const resp = await fetch(FEED_URL);
  const xml = await resp.text();
  const entries: FeedEntry[] = [];

  const entryBlocks = xml.split("<entry>").slice(1);
  for (const block of entryBlocks) {
    const entryXml = block.split("</entry>")[0];
    entries.push({
      title: extractTag(entryXml, "title"),
      url: extractLink(entryXml),
      published: extractTag(entryXml, "published"),
      updated: extractTag(entryXml, "updated"),
      content: extractTag(entryXml, "content"),
      categories: extractCategories(entryXml),
    });
  }

  return entries;
}

async function getProcessedUrls(): Promise<Set<string>> {
  try {
    const stored = await blob.getJSON(BLOB_KEY) as string[] | null;
    return new Set(stored ?? []);
  } catch {
    return new Set();
  }
}

async function setProcessedUrls(urls: Set<string>): Promise<void> {
  await blob.setJSON(BLOB_KEY, [...urls]);
}

// --- Source extraction ---

function extractLinks(html: string): string[] {
  const matches = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

async function readExternalPage(url: string): Promise<string> {
  const jinaKey = Deno.env.get("JINA_AI_API_KEY");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (jinaKey) headers["Authorization"] = `Bearer ${jinaKey}`;

  const resp = await fetch(`${JINA_BASE}${url}`, { headers });
  if (!resp.ok) return `Failed to fetch ${url}: ${resp.status}`;
  const data = await resp.json();
  return data.data?.content?.slice(0, 4000) || "";
}

// --- Agent loop ---

async function executeToolWithJina(name: string, input: Record<string, unknown>): Promise<string> {
  if (name === "read_webpage") {
    return readExternalPage(input.url as string);
  }
  return executeTool(name, input);
}

async function getToneGuide(): Promise<string> {
  return fetch(`${SITE_URL}/llms/prompts/tone.txt`).then((r) => r.text());
}

async function agentLoop(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  // Research phase: Sonnet handles tool use to gather additional context
  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await anthropic.messages.create({
      model: RESEARCH_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      tools: tools as Anthropic.Messages.Tool[],
      messages,
    });

    const toolBlocks = response.content.filter((b) => b.type === "tool_use");

    if (toolBlocks.length === 0) break;

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = await Promise.all(
      toolBlocks.map(async (block) => {
        const result = await executeToolWithJina(block.name, block.input as Record<string, unknown>);
        return { type: "tool_result" as const, tool_use_id: block.id, content: result };
      }),
    );
    messages.push({ role: "user", content: toolResults });
  }

  // Critique phase: Opus writes the final critique with all gathered context
  messages.push({
    role: "user",
    content: "Write your critique now based on the post and all the context above. Output ONLY the critique — nothing else.",
  });
  const finalResponse = await anthropic.messages.create({
    model: CRITIQUE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  });
  return finalResponse.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

// --- Critique generation ---

function buildSystemPrompt(toneGuide: string): string {
  return `You are a constructive critic and writing mentor for a personal knowledge garden at joshbeckman.org. You have access to tools that let you search and read posts in the garden, and read external web pages.

Your job: given a post the author has written, research the garden and the post's sources, then write a thorough, constructive critique.

Strategy:
1. Read the post carefully — understand its argument, tone, and intent
2. Identify links in the post: for internal links (joshbeckman.org), use get_post to read them; for external links, use read_webpage
3. Search the garden for related prior writing — look for posts that support, contradict, or extend this one
4. Compose your critique

Your critique should cover these areas (skip any that don't apply):

**Argument strength**: Is the reasoning sound? Are there logical gaps, unsupported claims, or unstated assumptions? Where is the argument strongest?

**Writing clarity**: Is the prose clear and direct? Are there passages that are vague, redundant, or could be tightened? Does the tone match the intent?

**Connections**: What other posts in the garden relate to this one? Where does this post reinforce or contradict prior writing? Are there threads worth pulling on?

**Sources**: If the post references external work, does it engage with those sources fairly? Are there sources the author should consider?

**Growth edges**: What would make this piece stronger? What questions should the author sit with? What's the next post this one is asking for?

Guidelines:
- Be direct and specific — cite passages when commenting on them
- Be constructive — the goal is to help the author grow, not to tear down
- Use markdown links like [Title](URL) when referencing garden posts or external sources
- Write in second person ("you wrote...", "your argument...")
- Keep it concise but thorough — aim for 3-6 paragraphs
- Don't summarize the post back to the author — they wrote it, they know what it says

Follow this writing style guide for your own tone:

${toneGuide}

CRITICAL FORMAT RULE: Your final response must contain ONLY the critique. No preamble, no "Here is my critique", no meta-commentary about your process.`;
}

export async function critiquePost(postUrl: string): Promise<{
  title: string;
  url: string;
  critique: { markdown: string; html: string };
} | null> {
  // Fetch tone guide and search data in parallel
  const [toneGuide, searchData] = await Promise.all([getToneGuide(), getSearchData()]);
  const systemPrompt = buildSystemPrompt(toneGuide);

  const postPath = postUrl.startsWith("http") ? new URL(postUrl).pathname : postUrl;
  const post = (Object.values(searchData) as Post[]).find(
    (p) => p.url === postPath || SITE_URL + p.url === postUrl,
  );

  if (!post) return null;

  const title = post.title;
  const fullUrl = SITE_URL + post.url;
  const postSummary = formatPost(post);
  const links = extractLinks(post.content || "");
  const externalLinks = links.filter((l) => !l.includes("joshbeckman.org"));
  const internalLinks = links.filter((l) => l.includes("joshbeckman.org"));

  let userMessage = `Here is the post to critique:\n\n${postSummary}`;
  if (post.content && post.content.length > 1000) {
    userMessage += `\n\nFull content:\n${post.content}`;
  }
  if (internalLinks.length > 0) {
    userMessage += `\n\nInternal links found in the post (use get_post to read these):\n${internalLinks.join("\n")}`;
  }
  if (externalLinks.length > 0) {
    userMessage += `\n\nExternal links found in the post (use read_webpage to read these):\n${externalLinks.join("\n")}`;
  }

  const rawCritique = await agentLoop(systemPrompt, userMessage);
  const critiqueMarkdown = rawCritique.replace(/\]\(\//g, `](${SITE_URL}/`);
  const critiqueHtml = await marked.parse(critiqueMarkdown);

  return { title, url: fullUrl, critique: { markdown: critiqueMarkdown, html: critiqueHtml } };
}

export async function critiqueDraft(title: string, content: string): Promise<{
  title: string;
  critique: { markdown: string; html: string };
}> {
  const toneGuide = await getToneGuide();
  const systemPrompt = buildSystemPrompt(toneGuide);

  const links = extractLinks(content);
  const externalLinks = links.filter((l) => !l.includes("joshbeckman.org"));
  const internalLinks = links.filter((l) => l.includes("joshbeckman.org"));

  let userMessage = `Here is a draft post to critique:\n\n# ${title}\n\n${content}`;
  if (internalLinks.length > 0) {
    userMessage += `\n\nInternal links found in the post (use get_post to read these):\n${internalLinks.join("\n")}`;
  }
  if (externalLinks.length > 0) {
    userMessage += `\n\nExternal links found in the post (use read_webpage to read these):\n${externalLinks.join("\n")}`;
  }

  const rawCritique = await agentLoop(systemPrompt, userMessage);
  const critiqueMarkdown = rawCritique.replace(/\]\(\//g, `](${SITE_URL}/`);
  const critiqueHtml = await marked.parse(critiqueMarkdown);

  return { title, critique: { markdown: critiqueMarkdown, html: critiqueHtml } };
}

export type Annotation = {
  lnum: number;
  end_lnum?: number;
  type: "I" | "W" | "E";
  text: string;
  phrase?: string;
};

export async function annotate(content: string, critique: string): Promise<Annotation[]> {
  const numbered = content.split("\n").map((line, i) => `${i + 1}: ${line}`).join("\n");

  const response = await anthropic.messages.create({
    model: RESEARCH_MODEL,
    max_tokens: 4096,
    system: `You map critique feedback onto specific lines in a source document. Given a numbered document and a critique, produce a JSON array of annotations.

Each annotation has:
- "lnum": the primary line number the feedback applies to
- "end_lnum": (optional) last line number if the feedback spans a range
- "type": "I" for suggestions/connections, "W" for writing clarity issues or weak arguments, "E" for factual errors or logical flaws
- "text": a concise (1-2 sentence) version of the critique point
- "phrase": (optional) a short exact substring from the document that this feedback targets — must appear verbatim on the given line. Use this when the feedback is about a specific word, phrase, or sentence rather than the whole line. Omit for general line-level feedback.

Guidelines:
- Map every substantive point from the critique to at least one line
- IMPORTANT: "lnum" must point to a line with actual text content, never to a blank/empty line. If the nearest line is blank, use the next non-blank line
- IMPORTANT: "phrase" must be copied exactly from the document — do not paraphrase or modify it
- Prefer "I" for most feedback — reserve "W" and "E" for clear problems
- If a critique point is about the piece overall (structure, missing content), attach it to the most relevant line (e.g. the first line of the section it would belong in)
- Keep text brief — the full critique is available separately

Output ONLY valid JSON. No markdown fences, no commentary.`,
    messages: [
      {
        role: "user",
        content: `## Document\n\n${numbered}\n\n## Critique\n\n${critique}`,
      },
    ],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return JSON.parse(text);
}

// --- Email ---

function buildEmailHtml(title: string, url: string, critiqueHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Sans+Condensed:wght@600&display=swap">
</head>
<body style="font-family: 'IBM Plex Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #151515; line-height: 1.6; background-color: #EBEDEA;">
  <h2 style="font-family: 'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif; margin-bottom: 4px;"><a href="${url}" style="color: #903465; text-decoration: underline;">${title}</a></h2>
  <p style="margin-top: 0; color: #666; font-size: 14px;">Critique from your writing mentor</p>
  <hr style="border: none; border-top: 2px solid #903465; margin: 16px 0;">
  ${critiqueHtml}
  <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
  <p style="color: #999; font-size: 12px;">Generated by <a href="https://val.town" style="color: #903465;">criticCron</a></p>
</body>
</html>`;
}

export async function emailCritique(title: string, url: string, critiqueHtml: string): Promise<void> {
  const html = buildEmailHtml(title, url, critiqueHtml);
  await email({
    subject: `Critique: ${title}`,
    html,
  });
}

// --- Cron entry point ---

export async function processFeed(): Promise<{ processed: string[]; skipped: number }> {
  const entries = await parseFeed();
  if (entries.length === 0) return { processed: [], skipped: 0 };

  const feedUrls = new Set(entries.map((e) => e.url));
  const previouslyProcessed = await getProcessedUrls();

  // Prune records for posts no longer in the feed
  const currentProcessed = new Set([...previouslyProcessed].filter((url) => feedUrls.has(url)));

  const eligible = entries.filter(
    (e) => new Date(e.published) >= new Date(CUTOFF_DATE) && !currentProcessed.has(e.url),
  );

  if (eligible.length === 0) {
    await setProcessedUrls(currentProcessed);
    return { processed: [], skipped: entries.length };
  }

  const processed: string[] = [];
  for (const entry of eligible) {
    const result = await critiquePost(entry.url);
    if (!result) continue;
    await emailCritique(result.title, result.url, result.critique.html);
    processed.push(entry.url);
    currentProcessed.add(entry.url);
  }

  await setProcessedUrls(currentProcessed);
  return { processed, skipped: entries.length - eligible.length };
}
