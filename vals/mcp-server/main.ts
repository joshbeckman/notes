console.log(`${new Date().toISOString()} Interpreting`);
import { Hono } from 'npm:hono';
import { toFetchResponse, toReqRes } from "npm:fetch-to-node";
import { z } from "npm:zod@3.25.75";
import lunr from "https://cdn.skypack.dev/lunr";
import { StreamableHTTPServerTransport } from "npm:@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer, ResourceTemplate } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
// import { AuthInfo } from "npm:@modelcontextprotocol/sdk/server/auth/types.js";
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
    version: "1.2.0",
    description: "MCP server that provides access to the posts and data on the website joshbeckman.org. It includes tools for searching and reading posts, getting proverbs, and more. Use it to access the published work, thoughts, and data of Josh Beckman.",
  },
  { capabilities: { logging: {} } });

  try {
    server.tool(
        "get_proverbs",
        "Retrieve Josh's favorite proverbs. Proverbs are short, pithy sayings that express a general truth or piece of advice that Josh holds dear. They serve as anchors for decisions and hold value. There are dozens of proverbs.",
        { limit: z.number().optional() },
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
    server.tool(
        "get_sequences",
        "Retrieve post sequences from the site. Sequences are groups of related posts that link, one to the next, forming a chain of thought on a tag. There are dozens of sequences.",
        { limit: z.number().optional(), tag: z.string() },
        async ({ limit, tag }) => {
            console.log(`${new Date().toISOString()} Fetching sequences data for tag: ${tag}`);
            const sequences = await fetch("https://www.joshbeckman.org/assets/js/sequences.json").then((res) => res.json());
            const results = sequences
                .filter((seq: any) => seq.topic == tag)
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
    server.tool(
        "get_sequence",
        "Retrieve a specific post sequence by its ID. Sequences are groups of related posts that link, one to the next, forming a chain of thought on a tag.",
        { id: z.string() },
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
    server.tool(
        "search_tags",
        "Search for tags used on the site. Tags are used to categorize posts and can be used to find related content. There are hundreds of tags.",
        { query: z.string(), limit: z.number().optional() },
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
    server.tool(
        "get_tag_urls",
        "Get the URLs of provided tags. This tool takes a list of tag names and returns their corresponding URLs on the site, where a user can see posts with that tag. It's useful for sharing links to sets of posts sharing the same tag.",
        { tags: z.array(z.string()) },
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
    server.tool(
        "get_tags",
        "Get a list of all tags used on the site. Tags are used to categorize posts and can be used to find related content.",
        {},
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
    server.tool(
        "get_post",
        "Get the full content and metadata of a specific post by its URL. This tool fetches the post data from the site and returns it in a structured format, including title, content, date, tags, author, and more.",
        { url: z.string() },
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
    server.tool(
      "search_posts",
      `Search for posts on the site, filtering by various metadata and attributes. This tool allows you to search for posts by query, limit the number of results (default: 3), filter by tag, date range, author, book, and category. There are thousands of posts.

Metadata:
- author_id: the ID assigned to the author of the post, defaults to "joshbeckman" if not present. Multiple posts can have the same author ID.
- book: the ID of the book/source of the post, if any. Multiple posts can be associated with the same book.
- date: the publish date of the post, in ISO format.
- tags: a comma-separated list of tags associated with the post.
- sequences: a comma-separated set of markdown-formatted (title and URL) sequences that the post is part of, if any.
- backklinks: a comma-separated set of post URLs that link to this post, if any.
- image: the URL of the feature image associated with the post, if any.
- relevance: a score indicating how relevant the post is to the search query, defaults to 1 if not present.
- category: available categories are: blog, notes, exercise, replies, and page.`,
      {
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

app.post("/mcp", async (c) => {
  const { req, res } = toReqRes(c.req.raw);

  // Disabling auth for now
  // if (!req.headers.authorization) {
  //   return c.json(
  //     {
  //       jsonrpc: "2.0",
  //       error: {
  //         code: -32603,
  //         message: "Authorization header is required",
  //       },
  //       id: null,
  //     },
  //     { status: 401 }
  //   );
  // }

  try {
    const transport: StreamableHTTPServerTransport =
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

    // Added for extra debuggability
    transport.onerror = console.error.bind(console);

    // Disabling auth for now
    // req.auth = { token: req.headers["authorization"]?.split(" ")[1] } as AuthInfo;

    console.log(`${new Date().toISOString()} Received MCP request`);
    await server.connect(transport);
    await transport.handleRequest(req, res, await c.req.json());
    console.log(`${new Date().toISOString()} MCP request handled`);

    res.on("close", () => {
      console.log(`${new Date().toISOString()} Request closed`);
      transport.close();
      server.close();
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
