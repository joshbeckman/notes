import Anthropic from "npm:@anthropic-ai/sdk";
import { blob } from "https://esm.town/v/std/blob";
import { email } from "https://esm.town/v/std/email";
import { marked } from "npm:marked";
import { executeTool, tools, getSearchData, formatPost, type Post } from "./search.ts";
import { hasToken, resolveFilePath, getRawFile, openDraftPR } from "./github.ts";

const anthropic = new Anthropic();
const RESEARCH_MODEL = "claude-sonnet-4-6";
const CRITIQUE_MODEL = "claude-opus-4-6";
const SITE_URL = "https://www.joshbeckman.org";
const FEED_URL = `${SITE_URL}/feed.xml`;
const JINA_BASE = "https://r.jina.ai/";
const MAX_TOOL_ROUNDS = 8;
const BLOB_KEY = "critic_cron_processed_urls";
const RECENT_CRITIQUES_KEY = "critic_cron_recent_critiques";
const RECENT_CRITIQUES_LIMIT = 5;
const CUTOFF_DATE = "2026-06-09";

type RecentCritique = {
  title: string;
  url: string;
  date: string;
  headlines: string[];
};

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

async function getRecentCritiques(): Promise<RecentCritique[]> {
  try {
    return (await blob.getJSON(RECENT_CRITIQUES_KEY) as RecentCritique[] | null) ?? [];
  } catch {
    return [];
  }
}

async function appendRecentCritique(entry: RecentCritique): Promise<void> {
  const existing = await getRecentCritiques();
  const next = [...existing.filter((e) => e.url !== entry.url), entry].slice(-RECENT_CRITIQUES_LIMIT);
  await blob.setJSON(RECENT_CRITIQUES_KEY, next);
}

function formatRecentCritiques(recent: RecentCritique[]): string {
  if (recent.length === 0) return "";
  const blocks = recent.map((r) => {
    const bullets = r.headlines.map((h) => `- ${h}`).join("\n");
    return `### [${r.title}](${r.url}) (${r.date})\n${bullets}`;
  });
  return `You have recently critiqued these posts. Vary your angles — don't repeat these headline points unless they apply directly and obviously to the new post:\n\n${blocks.join("\n\n")}\n\n---\n\n`;
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
): Promise<{ critique: string; headlines: string[] }> {
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
    content:
      "Write your critique now based on the post and all the context above. End with the literal delimiter line `---HEADLINES---` followed by 3-5 short bullets capturing the key angles you took. No preamble before the critique.",
  });
  const finalResponse = await anthropic.messages.create({
    model: CRITIQUE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  });
  const raw = finalResponse.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const parts = raw.split(/^---HEADLINES---\s*$/m);
  const critique = parts[0].trim();
  const headlines = (parts[1] ?? "")
    .split("\n")
    .map((l) => l.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);

  return { critique, headlines };
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

CRITICAL FORMAT RULE: Your final response is the critique itself, then a line containing only \`---HEADLINES---\`, then 3-5 short bullets (one per line, prefixed with "- ") that capture the distinct angles your critique took. The headlines feed an internal memory of recent critiques so future runs can vary their angles — make them specific (e.g. "pushed back on tone-flattening in the second half"), not generic ("commented on writing"). No preamble before the critique, no meta-commentary about your process.`;
}

export async function critiquePost(postUrl: string): Promise<{
  title: string;
  url: string;
  critique: { markdown: string; html: string };
  headlines: string[];
} | null> {
  const [toneGuide, searchData, recent] = await Promise.all([
    getToneGuide(),
    getSearchData(),
    getRecentCritiques(),
  ]);
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

  let userMessage = formatRecentCritiques(recent);
  userMessage += `Here is the post to critique:\n\n${postSummary}`;
  if (post.content) {
    userMessage += `\n\nFull content:\n${post.content}`;
  }
  if (internalLinks.length > 0) {
    userMessage += `\n\nInternal links found in the post (use get_post to read these):\n${internalLinks.join("\n")}`;
  }
  if (externalLinks.length > 0) {
    userMessage += `\n\nExternal links found in the post (use read_webpage to read these):\n${externalLinks.join("\n")}`;
  }

  const { critique, headlines } = await agentLoop(systemPrompt, userMessage);
  const critiqueMarkdown = critique.replace(/\]\(\//g, `](${SITE_URL}/`);
  const critiqueHtml = await marked.parse(critiqueMarkdown);

  return {
    title,
    url: fullUrl,
    critique: { markdown: critiqueMarkdown, html: critiqueHtml },
    headlines,
  };
}

export async function critiqueDraft(title: string, content: string): Promise<{
  title: string;
  critique: { markdown: string; html: string };
  headlines: string[];
}> {
  const [toneGuide, recent] = await Promise.all([getToneGuide(), getRecentCritiques()]);
  const systemPrompt = buildSystemPrompt(toneGuide);

  const links = extractLinks(content);
  const externalLinks = links.filter((l) => !l.includes("joshbeckman.org"));
  const internalLinks = links.filter((l) => l.includes("joshbeckman.org"));

  let userMessage = formatRecentCritiques(recent);
  userMessage += `Here is a draft post to critique:\n\n# ${title}\n\n${content}`;
  if (internalLinks.length > 0) {
    userMessage += `\n\nInternal links found in the post (use get_post to read these):\n${internalLinks.join("\n")}`;
  }
  if (externalLinks.length > 0) {
    userMessage += `\n\nExternal links found in the post (use read_webpage to read these):\n${externalLinks.join("\n")}`;
  }

  const { critique, headlines } = await agentLoop(systemPrompt, userMessage);
  const critiqueMarkdown = critique.replace(/\]\(\//g, `](${SITE_URL}/`);
  const critiqueHtml = await marked.parse(critiqueMarkdown);

  return { title, critique: { markdown: critiqueMarkdown, html: critiqueHtml }, headlines };
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

// --- Link suggestions -> draft PRs ---

// Common sentence-initial / generic capitalized words that aren't worth a
// focused proper-noun search (they'd just re-surface generic posts).
const STOPWORD_PROPER = new Set([
  "the", "this", "that", "there", "then", "these", "those", "and", "but", "for",
  "with", "from", "into", "unknown", "maybe", "today", "yesterday", "tomorrow",
  "here", "when", "where", "what", "while", "after", "before", "about", "also",
  "bopping", "probably", "inside", "good", "felt",
]);

type LinkInsertion = {
  old_string: string;
  new_string: string;
  target_url: string;
  target_title: string;
  why: string;
};

// Duplicated from search.ts's extractCategory rather than exporting it: keeping
// this local avoids coupling the link module to search internals for one line.
function categoryOf(url: string): string {
  if (url.includes("/notes/")) return "notes";
  if (url.includes("/exercise/")) return "exercise";
  if (url.includes("/replies/")) return "replies";
  return "blog";
}

// Split frontmatter so the model only edits the body. Editing frontmatter risks
// corrupting YAML that the model can't see the schema for.
function splitFrontmatter(raw: string): { front: string; body: string } {
  const m = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!m) return { front: "", body: raw };
  return { front: m[1], body: m[2] };
}

async function proposeLinkInsertions(
  title: string,
  body: string,
  candidates: Post[],
): Promise<LinkInsertion[]> {
  if (candidates.length === 0) return [];
  const candidateList = candidates
    .map((p) => `- [${p.title}](${p.url}) — ${(p.content || "").slice(0, 200).replace(/\s+/g, " ")}`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: RESEARCH_MODEL,
    max_tokens: 2048,
    // Deterministic: link suggestions should be reproducible, and default
    // sampling made the model flip-flop on obvious named-entity links run to run.
    temperature: 0,
    system: `You add internal links between posts in a personal knowledge garden. Given the raw Markdown body of a post and a list of related posts, propose links to weave in where a reader would genuinely benefit — a natural anchor phrase that the target post directly illuminates.

MOST VALUABLE: proper nouns in the body — an album, song, book, film, person, project, tool, or place — where one of the candidate posts IS that thing or is centrally about it. When a post names something the garden has its own post about, link the name. (Example: a workout log that says "listening to Slayyyter" should link "Slayyyter" to the album review of that artist.) These cross-domain links are the whole point; do not skip an obvious named-entity link just because the two posts are in different categories.

Do NOT link a post to near-identical sibling posts (e.g. one workout log to other workout logs) — that's noise.

Link ONLY the author's OWN words. NEVER add a link inside a quoted passage — Markdown blockquote lines starting with "> ", or text inside an embedded <blockquote> — those are someone else's words. If the author's original prose is only a sentence or two around a long quote, confine yourself to that prose.

Only link when the target post is SPECIFICALLY and SUBSTANTIALLY about the anchor. Do not link vague or common conceptual phrases ("proprietary environments", "the tradeoffs", "open source") on loose thematic similarity — that produces links the author will find irrelevant. A good link is one the author would obviously want; when in doubt, skip it.

Return a JSON array of insertions. Each has:
- "old_string": an EXACT substring copied verbatim from the body that appears exactly ONCE. Keep it short (a few words), and it must be plain text NOT already inside a Markdown link.
- "new_string": the same text with a Markdown link added, using a site-relative URL, e.g. "the [linchpin idea](/notes/446271384)".
- "target_url": the site-relative URL of the linked post (e.g. /blog/foo).
- "target_title": the linked post's title.
- "why": one sentence on why this link helps the reader.

Rules:
- Prefer a few high-value links over many weak ones, but always take an obvious named-entity link when one exists. Return [] only if nothing fits.
- Never link the same anchor twice. Never wrap text already inside a link or inside a heading.
- old_string MUST appear verbatim and exactly once in the body.
- Output ONLY valid JSON. No markdown fences, no commentary.`,
    messages: [
      {
        role: "user",
        content: `## Post: ${title}\n\n### Body\n\n${body}\n\n### Related posts you may link to\n\n${candidateList}`,
      },
    ],
  });

  return parseInsertions(collectText(response));
}

function collectText(response: Anthropic.Messages.Message): string {
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("\n")
    .trim();
}

// Tolerate preamble/citations around the array — web_search responses in
// particular wrap the JSON in prose, so slice to the outermost brackets.
function parseInsertions(text: string): LinkInsertion[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end <= start) return [];
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Drop hallucinated or dead URLs before committing them. web_search grounds the
// model in real results, but a cheap reachability check is worth it since a bad
// external link is worse than a missing one.
async function urlResolves(url: string): Promise<boolean> {
  try {
    const resp = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (criticCron link check)" },
    });
    return resp.ok;
  } catch {
    return false;
  }
}

// Find canonical external URLs for works the post names but doesn't link. Uses
// Anthropic's server-side web_search; failures (e.g. search unavailable) return
// [] so internal-link suggestions still work.
async function proposeExternalLinks(title: string, body: string): Promise<LinkInsertion[]> {
  let response: Anthropic.Messages.Message;
  try {
    response = await anthropic.messages.create({
      model: RESEARCH_MODEL,
      max_tokens: 2048,
      temperature: 0,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 } as unknown as Anthropic.Messages.Tool],
      system: `You find canonical external web URLs for specific works — essays, articles, blog posts, podcast episodes, videos, books, papers — that a post REFERENCES in the author's own words but does not link.

The author writes casual notes that name things without linking them, e.g. "Listening to Zvi's summary and rebuttal to the latest (Plan A) AI futures thinking" or "an interview on Dialectic with Jasmine Sun". Identify the specific referenced work, search the web for its canonical URL, and propose a link on a natural anchor phrase.

Rules:
- Only propose a link when web_search finds the SPECIFIC referenced work with high confidence — the exact essay/episode/video, not a topic overview, homepage, or search page. If you cannot identify the exact work, skip it.
- Prefer the primary/canonical source (the author's own blog or Substack, the podcast's episode page, the original video) over aggregators or reposts.
- Link ONLY the author's OWN words. NEVER add a link inside a quoted passage — Markdown blockquote lines starting with "> ", or text inside an embedded <blockquote>.
- Choose a concise anchor: a short verbatim substring of the prose that names the work (e.g. "Plan A" or "interview on Dialectic with Jasmine Sun").

Return a JSON array of insertions. Each has:
- "old_string": an EXACT substring copied verbatim from the body that appears exactly ONCE, not already inside a link.
- "new_string": the same text with a Markdown link added using the FULL https URL, e.g. "[Plan A](https://thezvi.wordpress.com/2026/07/11/...)".
- "target_url": the full https URL of the work.
- "target_title": the work's title.
- "why": one sentence on why this link helps the reader.

Return [] if no referenced work can be confidently located. Output ONLY the JSON array — no prose, no markdown fences.`,
      messages: [{ role: "user", content: `## Post: ${title}\n\n### Body\n\n${body}` }],
    });
  } catch (err) {
    console.error("web_search external-link pass failed:", err);
    return [];
  }

  const proposed = parseInsertions(collectText(response));
  // Only keep external (http) targets that actually resolve.
  const checked = await Promise.all(
    proposed.map(async (ins) =>
      ins.target_url?.startsWith("http") && (await urlResolves(ins.target_url)) ? ins : null
    ),
  );
  return checked.filter((x): x is LinkInsertion => x !== null);
}

// Length-preserving normalization for matching only. Imported posts carry
// typographic punctuation (’ “ ” — nbsp) that the model reproduces as ASCII, so
// verbatim indexOf fails. Every substitution is one-char-to-one-char so indices
// stay aligned with the original text and we can slice the original back out.
function normalizeForMatch(s: string): string {
  return s
    .replace(/[’‘‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\u00a0/g, " ");
}

function isInsideQuote(body: string, idx: number): boolean {
  const lineStart = body.lastIndexOf("\n", idx - 1) + 1;
  const line = body.slice(lineStart, body.indexOf("\n", idx) === -1 ? undefined : body.indexOf("\n", idx));
  if (/^\s*>/.test(line)) return true; // Markdown blockquote
  // Embedded HTML quote: an unclosed <blockquote> before the anchor.
  const before = body.slice(0, idx).toLowerCase();
  return before.lastIndexOf("<blockquote") > before.lastIndexOf("</blockquote>");
}

// Apply insertions to the body, keeping only those whose old_string is present
// exactly once and not inside an existing link. Returns the edited body and the
// insertions actually applied.
function applyInsertions(
  body: string,
  insertions: LinkInsertion[],
): { body: string; applied: LinkInsertion[]; rejected: { anchor: string; reason: string }[] } {
  let out = body;
  const applied: LinkInsertion[] = [];
  const rejected: { anchor: string; reason: string }[] = [];
  for (const ins of insertions) {
    if (!ins.old_string || !ins.new_string) {
      rejected.push({ anchor: ins.old_string ?? "(missing)", reason: "missing old_string or new_string" });
      continue;
    }
    const normOld = normalizeForMatch(ins.old_string);
    const normBody = normalizeForMatch(out); // same length as `out`, so indices align
    const idx = normBody.indexOf(normOld);
    if (idx === -1) {
      rejected.push({ anchor: ins.old_string, reason: "anchor not found verbatim in body" });
      continue;
    }
    if (normBody.indexOf(normOld, idx + 1) !== -1) {
      rejected.push({ anchor: ins.old_string, reason: "anchor appears more than once (ambiguous)" });
      continue;
    }
    // Never link inside a quoted passage — those are someone else's words, and
    // the author only wants links added to their own prose.
    if (isInsideQuote(out, idx)) {
      rejected.push({ anchor: ins.old_string, reason: "anchor is inside a quoted passage" });
      continue;
    }
    // The model wraps a sub-span of the anchor in one Markdown link; validate it
    // only ADDS link markup (stripped text must equal the anchor), then rebuild
    // the edit from the ORIGINAL characters so typographic punctuation is
    // preserved rather than replaced with the model's ASCII version.
    const link = ins.new_string.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const strippedNorm = normalizeForMatch(ins.new_string.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"));
    if (!link || strippedNorm !== normOld) {
      rejected.push({ anchor: ins.old_string, reason: "new_string changes text beyond adding a link" });
      continue;
    }
    const origAnchor = out.slice(idx, idx + normOld.length);
    const linkStart = link.index!; // offset of "[" == length of plain text before the link
    const linkTextLen = link[1].length;
    const replacement =
      origAnchor.slice(0, linkStart) +
      `[${origAnchor.slice(linkStart, linkStart + linkTextLen)}](${link[2]})` +
      origAnchor.slice(linkStart + linkTextLen);
    out = out.slice(0, idx) + replacement + out.slice(idx + normOld.length);
    applied.push(ins);
  }
  return { body: out, applied, rejected };
}

export type LinkResult =
  | { ok: true; prUrl: string; insertions: LinkInsertion[] }
  | { ok: false; reason: string };

// Gather related garden posts via the same search index the critic uses, then
// propose + apply link edits and open a draft PR against the source post.
export async function suggestLinks(postUrl: string): Promise<LinkResult> {
  if (!hasToken()) return { ok: false, reason: "no GH_NOTES_TOKEN configured" };

  const searchData = await getSearchData();
  const postPath = postUrl.startsWith("http") ? new URL(postUrl).pathname : postUrl;
  const post = (Object.values(searchData) as Post[]).find(
    (p) => p.url === postPath || SITE_URL + p.url === postUrl,
  );
  if (!post) return { ok: false, reason: `post not found in search index: ${postPath}` };

  const filePath = await resolveFilePath(post.url);
  if (!filePath) return { ok: false, reason: `could not resolve repo file for ${post.url}` };
  const file = await getRawFile(filePath);
  if (!file) return { ok: false, reason: `could not read ${filePath} from GitHub` };

  const { front, body } = splitFrontmatter(file.content);

  // Seed candidates from title, tags, AND body text. Title+tags alone only find
  // topically-similar posts; the highest-value links are often cross-domain and
  // hinge on a proper noun buried in the prose (e.g. a weight-training log that
  // names the album it mentions), which only a body search surfaces.
  const bodyText = body
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`!\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
  // Proper nouns are searched on their own because a broad body-text query is
  // dominated by common words (a workout log's "gym/weight/lifts" buries the one
  // distinctive token "Slayyyter"), truncating the very post worth linking. A
  // distinctive token gets its own focused search so its target survives.
  const properNouns = [...new Set((bodyText.match(/\b[A-Z][A-Za-z0-9$'’]{2,}\b/g) ?? []))]
    .filter((w) => !STOPWORD_PROPER.has(w.toLowerCase()))
    .slice(0, 8);
  const broadQueries = [
    post.title,
    bodyText,
    ...(post.tags || "").split(" ").filter(Boolean).slice(0, 4),
  ].filter(Boolean);

  const seen = new Map<string, Post>();
  const collect = async (q: string, limit: number) => {
    const raw = await executeTool("search_posts", { query: q, limit });
    for (const [, matchPath] of raw.matchAll(/\]\((https?:\/\/[^)]+|\/[^)]+)\)/g)) {
      const p = (Object.values(searchData) as Post[]).find((x) => SITE_URL + x.url === matchPath || x.url === matchPath);
      if (p && p.url !== post.url) seen.set(p.url, p);
    }
  };
  // Proper-noun hits first so they claim candidate slots before broad noise.
  for (const noun of properNouns) await collect(noun, 3);
  for (const q of broadQueries) await collect(q, 5);

  // Cap same-category candidates. A post's best links are usually cross-domain
  // (a workout log -> the album it names); without this cap the list fills with
  // near-identical siblings (12 other workout logs) that bury the one good
  // target and make even a capable model decline to link anything.
  const sourceCategory = categoryOf(post.url);
  let sameCat = 0;
  const candidates = [...seen.values()]
    .filter((c) => {
      if (categoryOf(c.url) !== sourceCategory) return true;
      return ++sameCat <= 3;
    })
    .slice(0, 15);

  // Internal (garden) and external (web) links are independent passes: internal
  // needs candidates from the index; external only needs the prose + web search.
  // External must not be gated on internal candidates existing — a workout log
  // that names a Substack essay has no garden match but a valuable external one.
  const [internal, external] = await Promise.all([
    candidates.length > 0 ? proposeLinkInsertions(post.title, body, candidates) : Promise.resolve([]),
    proposeExternalLinks(post.title, body),
  ]);
  // Longest anchor first so the most specific reference claims its span. When an
  // external "interview on Dialectic with Jasmine Sun" overlaps an internal
  // "Dialectic", the specific episode link should win over a generic-podcast one
  // pointing at an unrelated episode.
  const proposed = [...internal, ...external].sort(
    (a, b) => (b.old_string?.length ?? 0) - (a.old_string?.length ?? 0),
  );
  const { body: newBody, applied, rejected } = applyInsertions(body, proposed);
  if (applied.length === 0) {
    const detail = rejected.map((r) => `"${r.anchor}": ${r.reason}`).join("; ");
    return { ok: false, reason: `no worthwhile links (proposed ${proposed.length}). ${detail}` };
  }

  const bullets = applied
    .map((i) => {
      const target = i.target_url.startsWith("http") ? i.target_url : SITE_URL + i.target_url;
      const kind = i.target_url.startsWith("http") ? "🌐" : "🔗";
      return `- ${kind} Link **${i.old_string}** → [${i.target_title}](${target}) — ${i.why}`;
    })
    .join("\n");
  const prBody = `Suggested by criticCron while critiquing [${post.title}](${SITE_URL}${post.url}).\n\n${bullets}\n\nOpened as a draft — review and mark ready to merge, or close.\n\nGenerated-by: AI (criticCron/Anthropic/${RESEARCH_MODEL})`;

  const prUrl = await openDraftPR({
    path: filePath,
    sha: file.sha,
    newContent: front + newBody,
    branch: `critic/links-${postPath.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-${Date.now()}`,
    commitMessage: `docs: add links to ${post.title}`,
    title: `Add links to “${post.title}”`,
    body: prBody,
  });

  return { ok: true, prUrl, insertions: applied };
}

// --- Email ---

function buildLinkPrHtml(prUrl: string | null): string {
  if (!prUrl) return "";
  return `<div style="margin: 16px 0; padding: 12px 16px; background: #f3eef1; border-left: 3px solid #903465;">
    <p style="margin: 0; font-size: 14px;">🔗 I opened a <a href="${prUrl}" style="color: #903465; text-decoration: underline; font-weight: 600;">draft PR with suggested links</a>. Review and mark ready, or close it.</p>
  </div>`;
}

function buildEmailHtml(title: string, url: string, critiqueHtml: string, prUrl: string | null): string {
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
  ${buildLinkPrHtml(prUrl)}
  ${critiqueHtml}
  <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
  <p style="color: #999; font-size: 12px;">Generated by <a href="https://val.town" style="color: #903465;">criticCron</a></p>
</body>
</html>`;
}

export async function emailCritique(
  title: string,
  url: string,
  critiqueHtml: string,
  prUrl: string | null = null,
): Promise<void> {
  const html = buildEmailHtml(title, url, critiqueHtml, prUrl);
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

  // Persist the pruned set before any critique runs so the prune survives even
  // if the first entry throws or the request times out mid-batch.
  await setProcessedUrls(currentProcessed);

  const processed: string[] = [];
  for (const entry of eligible) {
    try {
      const result = await critiquePost(entry.url);
      if (!result) continue;
      // Link PRs are a best-effort extra; a GitHub failure must not block the
      // critique email or re-strand the whole batch.
      let prUrl: string | null = null;
      try {
        const links = await suggestLinks(entry.url);
        prUrl = links.ok ? links.prUrl : null;
      } catch (err) {
        console.error(`Link suggestion failed for ${entry.url}:`, err);
      }
      await emailCritique(result.title, result.url, result.critique.html, prUrl);
      // Mark processed immediately after the email succeeds. Writing once at the
      // end means any later failure/timeout discards the whole batch, which makes
      // the cron re-email the same newest posts every run.
      currentProcessed.add(entry.url);
      await setProcessedUrls(currentProcessed);
      processed.push(entry.url);
      if (result.headlines.length > 0) {
        await appendRecentCritique({
          title: result.title,
          url: result.url,
          date: entry.published.slice(0, 10),
          headlines: result.headlines,
        });
      }
    } catch (err) {
      // Don't let one bad entry abort the batch and strand the rest unprocessed.
      console.error(`Failed to critique ${entry.url}:`, err);
    }
  }

  return { processed, skipped: entries.length - eligible.length };
}
