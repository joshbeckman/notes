import lunr from "https://cdn.skypack.dev/lunr";

const SITE_URL = "https://www.joshbeckman.org";

export type Post = {
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

let _searchData: Record<string, Post> | null = null;
let _index: lunr.Index | null = null;
let _tags: Array<{ name: string; url: string }> | null = null;

export function resetCache() {
  _searchData = null;
  _index = null;
  _tags = null;
}

export async function getSearchData(): Promise<Record<string, Post>> {
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

export function formatPost(post: Post): string {
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

export async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
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

export const tools = [
  {
    name: "search_posts",
    description:
      "Search for posts in the knowledge garden by query text. Keyword-based search. Use short queries with specific nouns and terms. Try multiple focused queries rather than one complex one.",
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
      "Get the full content and metadata of a specific post by its URL path (e.g. /notes/446271384).",
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
    description: "List all tags used in the knowledge garden.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "search_tags",
    description: "Search for tags matching a query string.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Tag name to search for" },
      },
      required: ["query"],
    },
  },
  {
    name: "read_webpage",
    description:
      "Read the content of an external web page via URL. Use this to read sources linked from a post that are NOT on joshbeckman.org. Returns the page title and markdown content.",
    input_schema: {
      type: "object" as const,
      properties: {
        url: { type: "string", description: "Full URL of the external web page to read" },
      },
      required: ["url"],
    },
  },
];
