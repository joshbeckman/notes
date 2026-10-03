console.log(`${new Date().toISOString()} Interpreting`);
import { Hono } from 'npm:hono';
import { toFetchResponse, toReqRes } from "npm:fetch-to-node";
import { z } from "npm:zod";
import lunr from "https://cdn.skypack.dev/lunr";
import { StreamableHTTPServerTransport } from "npm:@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer, ResourceTemplate } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
console.log(`${new Date().toISOString()} Loaded libraries`);

const SITE_URL = "https://www.joshbeckman.org";
lunr.tokenizer.separator = /[\s/]+/;

type Post = {
  author_id: string;
  book: number | string;
  content: string;
  date: string;
  doc: string;
  image: string;
  // Rating, exercise stats, and weather as the post page displays them. Absent
  // on posts with none, and absent entirely from indexes built before the site
  // shipped it, so every read has to tolerate undefined.
  meta?: string;
  tags: string;
  title: string;
  type: string;
  url: string;
  backlinks: Array<string>;
  sequences: Array<string>;
};
type Tag = {
  name: string;
  url: string;
};

function postFilter(post: Post) {
  return post.type == "post" || post.type == "page";
}

function search(input: string, index: lunr.Index, searchData: Record<string, Post>) {
  let results = index.search(input);

  if ((results.length == 0) && (input.length > 2)) {
    let tokens = lunr.tokenizer(input).filter(function(token, i) {
      return token.str.length < 20;
    });

    if (tokens.length > 0) {
      results = index.query(function(query) {
        query.term(tokens, {
          editDistance: Math.round(Math.sqrt(input.length / 2 - 1)),
        });
      });
    }
  }
  return results.map((result) => {
    const item = searchData[result.ref];
    if (!item) {
      return null; // Skip if item not found
    }
    return {
      title: item.title,
      content: item.content,
      meta: item.meta,
      type: item.type,
      url: item.url.startsWith("http") ? item.url : SITE_URL + item.url,
      book: item.book,
      author_id: item.author_id,
      tags: item.tags,
      sequences: item.sequences,
      date: item.date,
      image: item.image,
      backlinks: item.backlinks,
      category: extractPostCategory(item),
      score: result.score,
      match: result.matchData.metadata,
    };
  }).filter((item) => item !== null); // Filter out null items
}

function formatPage(page: Post) {
    return [
        `# [${page.title}](${page.url.startsWith("http") ? page.url : SITE_URL + page.url})`,
        "",
        page.content,
        "",
        "metadata:",
        `- date: ${page.date}`,
        `- tags: ${(page.tags || "").split(" ").join(", ")}`,
        `- author_id: ${page.author_id}`,
        `- category: ${page.category}`,
        (page.meta ? `- meta: ${page.meta}` : null),
        (page.backlinks?.length > 0 ? `- backlinks: ${page.backlinks.map((b) => SITE_URL + b).join(", ")}` : null),
        (page.sequences?.length > 0 ? `- sequences: ${page.sequences.map(seq => `[Sequence ${seq.id} on ${seq.topic}](${SITE_URL}/sequences#${seq.id})`).join(", ")}` : null),
        (page.book ? `- book_id: ${page.book}` : null),
        (page.image ? `- image: ${page.image}` : null),
        (page.score ? `- relevance: ${page.score.toFixed(3)}` : null),
    ].filter((a) => a !== null).join("\n");
}

function extractPostCategory(post: Post) {
    if (post.type == "page") {
        return "page";
    }
    if (post.type == "tag") {
        return "tag";
    }
    if (post.url.includes("/notes/")) {
        return "notes";
    } else if (post.url.includes("/exercise/")) {
        return "exercise";
    } else if (post.url.includes("/replies/")) {
        return "replies";
    } else {
        return "blog";
    }
};

// Cache for the MCP server instance
let mcpServerInstance: McpServer | null = null;

/**
 * Sets up the MCP server with resources and tools based on the content on joshbeckman.org
 * Uses a cached instance if available
 */
async function setupMcpServer(): Promise<McpServer> {
  // Return cached instance if available
  if (mcpServerInstance) {
    return mcpServerInstance;
  }

  console.log(`${new Date().toISOString()} Registering MCP server tools`);
  // Create a new MCP server
  const server = new McpServer({
    name: "joshbeckman.org Content",
    version: "1.3.0",
    description: "MCP server that provides access to the posts and data on the website joshbeckman.org. It includes tools for searching and reading posts, getting proverbs, and more. Use it to access the published work, thoughts, and data of Josh Beckman.",
  });

  try {
    server.registerTool(
        "get_proverbs",
        {
            description: "Retrieve Josh's favorite proverbs. Proverbs are short, pithy sayings that express a general truth or piece of advice that Josh holds dear. They serve as anchors for decisions and hold value. There are dozens of proverbs.",
            inputSchema: { limit: z.number().optional() },
            annotations: {
                title: "Get Proverbs",
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: false,
            },
        },
        async ({ limit }) => {
            console.log(`${new Date().toISOString()} Fetching proverbs data`);
            const proverbs = await fetch("https://www.joshbeckman.org/assets/js/proverbs.json").then((res) => res.json());
            const results = proverbs
                .sort(() => Math.random() - 0.5)
                .slice(0, limit || 100);
            console.log(`${new Date().toISOString()} Proverbs data fetched`);
            const data = results.join("\n");
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
    server.registerTool(
        "get_sequences",
        {
            description: "Retrieve post sequences from the site. Sequences are groups of related posts that link, one to the next, forming a chain of thought on a tag. There are dozens of sequences.",
            inputSchema: { limit: z.number().optional(), tag: z.string().optional() },
            annotations: {
                title: "Get Sequences",
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async ({ limit, tag }) => {
            console.log(`${new Date().toISOString()} Fetching sequences data for tag: ${tag}`);
            const sequences = await fetch("https://www.joshbeckman.org/assets/js/sequences.json").then((res) => res.json());
            const results = sequences
                .filter((seq: any) => seq.topic.toLowerCase().includes(tag ? tag.toLowerCase() : ""))
                .slice(0, limit || 100);
            console.log(`${new Date().toISOString()} Sequences data fetched`);
            if (results.length == 0) {
                return {
                    content: [{ type: "text", text: `No sequences found for tag "${tag}".` }]
                };
            }
            const data = results.map((seq: any) => {
                return `## [Sequence on ${seq.topic}](${seq.id})\n\n${seq.posts.map((post: any) => `[${post.title}](${SITE_URL}${post.url})`).join("\n")}`;
            }).join("\n\n---\n\n");
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
    server.registerTool(
        "get_sequence",
        {
            description: "Retrieve a specific post sequence by its ID. Sequences are groups of related posts that link, one to the next, forming a chain of thought on a tag.",
            inputSchema: { id: z.string() },
            annotations: {
                title: "Get Sequence",
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async ({ id }) => {
            console.log(`${new Date().toISOString()} Fetching sequence data for ID: ${id}`);
            const sequences = await fetch("https://www.joshbeckman.org/assets/js/sequences.json").then((res) => res.json());
            const sequence = sequences.find((seq: any) => seq.id == id);
            console.log(`${new Date().toISOString()} Sequence data fetched`);
            if (!sequence) {
                return {
                    content: [{ type: "text", text: `Sequence with ID "${id}" not found.` }]
                };
            }
            const data = `## [Sequence on ${sequence.topic}](${sequence.id})\n\n${sequence.posts.map((post: any) => `[${post.title}](${SITE_URL}${post.url})`).join("\n")}`;
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
    server.registerTool(
        "search_tags",
        {
            description: "Search for tags used on the site. Tags are used to categorize posts and can be used to find related content. There are hundreds of tags.",
            inputSchema: { query: z.string(), limit: z.number().optional() },
            annotations: {
                title: "Search Tags",
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async ({ query, limit }) => {
            console.log(`${new Date().toISOString()} Fetching tags data for search`);
            const tags = await fetch("https://www.joshbeckman.org/assets/js/tags.json").then((res) => res.json());
            const results = tags.filter((tag: Tag) => {
                return tag.name.toLowerCase().includes(query.toLowerCase());
            });
            console.log(`${new Date().toISOString()} Tags search completed`);
            if (results.length == 0) {
                return {
                    content: [{ type: "text", text: `No tags found matching "${query}".` }]
                };
            }
            const data = results
                .slice(0, limit || 10)
                .map((result) => {
                    return result.name;
                }).join("\n");
            console.log(`${new Date().toISOString()} search_tags: ${data}`);
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
    server.registerTool(
        "get_tag_urls",
        {
            description: "Get the URLs of provided tags. This tool takes a list of tag names and returns their corresponding URLs on the site, where a user can see posts with that tag. It's useful for sharing links to sets of posts sharing the same tag.",
            inputSchema: { tags: z.array(z.string()) },
            annotations: {
                title: "Get Tag URLs",
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async ({ tags }) => {
            console.log(`${new Date().toISOString()} Fetching tags data`);
            const sourceTags = await fetch("https://www.joshbeckman.org/assets/js/tags.json")
                .then((res) => res.json());
            console.log(`${new Date().toISOString()} Tags data fetched`);
            const matchingTags = sourceTags.filter((tag: Tag) => tags.includes(tag.name));
            if (matchingTags.length == 0) {
                return {
                    content: [{ type: "text", text: `No tags found matching "${tags.join(", ")}".` }]
                };
            }
            const data = matchingTags.map((tag) => {
                return `[${tag.name}](${SITE_URL}${tag.url})`;
            }).join("\n");
            console.log(`${new Date().toISOString()} get_tag_urls: ${data}`);
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
    server.registerTool(
        "get_tags",
        {
            description: "Get a list of all tags used on the site. Tags are used to categorize posts and can be used to find related content.",
            annotations: {
                title: "Get Tags",
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async () => {
            console.log(`${new Date().toISOString()} Fetching tags data`);
            const tags = await fetch("https://www.joshbeckman.org/assets/js/tags.json")
                .then((res) => res.json());
            const data = tags.sort((a, b) => a.name.localeCompare(b.name)).map((tag) => {
                return tag.name;
            }).join("\n");
            console.log(`${new Date().toISOString()} Tags data fetched`);
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
    server.registerTool(
        "get_post",
        {
            description: "Get the full content and metadata of a specific post by its URL. This tool fetches the post data from the site and returns it in a structured format, including title, content, date, tags, author, and more.",
            inputSchema: { url: z.string() },
            annotations: {
                title: "Get Post",
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async ({ url }) => {
            console.log(`${new Date().toISOString()} Fetching post data for URL: ${url}`);
            const searchData = await fetch("https://www.joshbeckman.org/assets/js/SearchData.json").then((res) => res.json());
            const db: Array<Post> = Object.values(searchData).filter(postFilter).map((post) => {
                post.author_id = post.author_id || "joshbeckman";
                post.category = extractPostCategory(post);
                return post;
            });
            const post = db.find((post) => post.url == url || `${SITE_URL}${post.url}` == url);
            console.log(`${new Date().toISOString()} Post data fetched`);
            if (!post) {
                return {
                    content: [{ type: "text", text: `Post ${url} not found.` }]
                };
            }
            return {
                content: [{ type: "text", text: formatPage(post) }]
            };
        }
    );
    server.registerTool(
      "search_posts",
      {
        description: `Search for posts on the site, filtering by various metadata and attributes. This tool allows you to search for posts by query, limit the number of results (default: 3), filter by tag, date range, author, book, and category. There are thousands of posts.

Metadata:
- author_id: the ID assigned to the author of the post, defaults to "joshbeckman" if not present. Multiple posts can have the same author ID.
- book: the ID of the book/source of the post, if any. Multiple posts can be associated with the same book.
- date: the publish date of the post, in ISO format.
- tags: a comma-separated list of tags associated with the post.
- sequences: a comma-separated set of markdown-formatted (title and URL) sequences that the post is part of, if any.
- backklinks: a comma-separated set of post URLs that link to this post, if any.
- image: the URL of the feature image associated with the post, if any.
- relevance: a score indicating how relevant the post is to the search query, defaults to 1 if not present.
- category: available categories are: blog, notes, exercise, replies, and page.
- meta: the post's displayed metadata (a star rating, exercise stats, weather), when it has any.`,
        inputSchema: {
          query: z.string().optional(),
          limit: z.number().min(1, "value must be at least 1").max(10, "value must be at most 10").default(3).optional(),
          excludePostUrls: z.array(z.string()).optional(),
          tag: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          author_id: z.string().optional(),
          book: z.string().optional(),
          category: z.enum(["blog", "notes", "exercise", "replies", "page"]).optional()
        },
        annotations: {
            title: "Search Posts",
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
      },
      async ({ query, limit, excludePostUrls, tag, startDate, endDate, author_id, book, category }) => {
        console.log(`${new Date().toISOString()} loading search data`);
        const [searchData, indexCache] = await Promise.all([
            fetch("https://www.joshbeckman.org/assets/js/SearchData.json").then((res) => res.json()),
            fetch("https://www.joshbeckman.org/assets/js/lunr-index.json").then((res) => res.json()),
        ]);
        console.log(`${new Date().toISOString()} search data loaded`);
        const db: Array<Post> = Object.values(searchData).filter(postFilter).map((post) => {
            post.author_id = post.author_id || "joshbeckman";
            post.category = extractPostCategory(post);
            return post;
        });
        let filteredPosts = db;
        if (query) {
          console.log(`${new Date().toISOString()} building index for search query`);
          const searchIndex = lunr.Index.load(indexCache);
          console.log(`${new Date().toISOString()} search index built`);
          filteredPosts = search(query, searchIndex, filteredPosts.reduce((acc, post) => {
            acc[post.url] = post;
            return acc;
          }, {} as Record<string, Post>)).filter(postFilter).map((post) => {
            post.author_id = post.author_id || "joshbeckman";
            post.category = extractPostCategory(post);
            return post;
          });
          console.log(`${new Date().toISOString()} search query completed`);
        }
        if (tag) {
          filteredPosts = filteredPosts.filter((post) => post.tags.includes(tag));
        }
        if (startDate) {
          filteredPosts = filteredPosts.filter((post) => post.date >= startDate);
        }
        if (endDate) {
          filteredPosts = filteredPosts.filter((post) => post.date <= endDate);
        }
        if (author_id) {
          filteredPosts = filteredPosts.filter((post) => post.author_id === author_id);
        }
        if (book) {
          filteredPosts = filteredPosts.filter((post) => post.book?.toString() === book);
        }
        if (category) {
          filteredPosts = filteredPosts.filter((post) => post.category === category);
        }
        if (excludePostUrls && excludePostUrls.length > 0) {
            filteredPosts = filteredPosts.filter((post) => !excludePostUrls.includes(post.url) && !excludePostUrls.includes(SITE_URL + post.url));
        }
        let results = filteredPosts.map((post) => {
            post.author_id = post.author_id || "joshbeckman";
            post.url = post.url.startsWith("http") ? post.url : SITE_URL + post.url;
            post.score = post.score || 1; // Default score to 1 if not present
            return post;
        });
        const data = results
            .slice(0, limit || 3)
            .map((result) => {
                return formatPage(result);
            }).join("\n\n---\n\n");
        return {
          content: [{ type: "text", text: data }]
        };
      }
    );
    // Cache the server instance
    mcpServerInstance = server;
    console.log(`${new Date().toISOString()} MCP server tools registered`);

    return server;
  } catch (error) {
    console.error("Error setting up MCP server:", error);
    throw error;
  }
}

const server = await setupMcpServer();
const app = new Hono();

// ---------- No-op OAuth flow for Claude.ai Custom Connectors ----------
// Claude.ai requires the full OAuth discovery + registration flow to
// complete even for public/authless MCP servers. These endpoints implement
// a minimal passthrough OAuth that auto-approves everything.

function baseUrl(reqUrl: string): string {
  const u = new URL(reqUrl);
  return `${u.protocol}//${u.host}`;
}

// RFC 9728 — Protected Resource Metadata
app.get("/.well-known/oauth-protected-resource", (c) => {
  const base = baseUrl(c.req.url);
  return c.json({
    resource: `${base}/mcp`,
    authorization_servers: [base],
  });
});
app.get("/.well-known/oauth-protected-resource/mcp", (c) => {
  const base = baseUrl(c.req.url);
  return c.json({
    resource: `${base}/mcp`,
    authorization_servers: [base],
  });
});

// RFC 8414 — OAuth Authorization Server Metadata
app.get("/.well-known/oauth-authorization-server", (c) => {
  const base = baseUrl(c.req.url);
  return c.json({
    issuer: base,
    authorization_endpoint: `${base}/authorize`,
    token_endpoint: `${base}/token`,
    registration_endpoint: `${base}/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    token_endpoint_auth_methods_supported: ["none"],
    code_challenge_methods_supported: ["S256"],
  });
});

// RFC 7591 — Dynamic Client Registration
app.post("/register", async (c) => {
  const body = await c.req.json();
  return c.json({
    client_id: "public",
    client_name: body.client_name || "MCP Client",
    redirect_uris: body.redirect_uris || [],
    grant_types: ["authorization_code"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  }, { status: 201 });
});

// OAuth authorize — redirect back immediately with a dummy code
app.get("/authorize", (c) => {
  const redirectUri = c.req.query("redirect_uri");
  const state = c.req.query("state");
  if (!redirectUri) {
    return c.text("Missing redirect_uri", 400);
  }
  const url = new URL(redirectUri);
  url.searchParams.set("code", "public-noop");
  if (state) url.searchParams.set("state", state);
  return c.redirect(url.toString(), 302);
});

// OAuth token — return a dummy bearer token
app.post("/token", async (c) => {
  return c.json({
    access_token: "public",
    token_type: "Bearer",
    expires_in: 3600,
  });
});
// ---------- End no-op OAuth flow ----------

app.post("/mcp", async (c) => {
  const { req, res } = toReqRes(c.req.raw);

  // Claude.ai sends Accept: */* which the SDK rejects because it does a
  // literal string check for "application/json" and "text/event-stream".
  if (req.headers.accept?.includes("*/*")) {
    req.headers.accept = "application/json, text/event-stream";
  }

  try {
    const transport: StreamableHTTPServerTransport =
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

    transport.onerror = console.error.bind(console);

    console.log(`${new Date().toISOString()} Received MCP request`);
    // Pre-set the negotiated protocol version on the response so it
    // survives the toFetchResponse conversion even if the transport
    // doesn't set it for non-initialize requests.
    res.setHeader("mcp-protocol-version", req.headers["mcp-protocol-version"] || "2025-06-18");

    await server.connect(transport);
    await transport.handleRequest(req, res, await c.req.json());
    console.log(`${new Date().toISOString()} MCP request handled`);

    res.on("close", () => {
      console.log(`${new Date().toISOString()} Request closed`);
      transport.close();
    });

    return toFetchResponse(res);
  } catch (e) {
    console.error(e);
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      },
      { status: 500 }
    );
  }
});

app.get("/mcp", async (c) => {
  console.log(`${new Date().toISOString()} Received GET MCP request`);
  return c.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    },
    { status: 405 }
  );
});

app.delete("/mcp", async (c) => {
  console.log(`${new Date().toISOString()} Received DELETE MCP request`);
  return c.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    },
    { status: 405 }
  );
});

/**
 * Val.town handler function for HTTP requests
 * This will be exposed as a Val.town HTTP endpoint
 */
export default app.fetch;