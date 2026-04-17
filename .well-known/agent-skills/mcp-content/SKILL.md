# joshbeckman.org Content API

Access blog posts, notes, tags, sequences, and proverbs from joshbeckman.org via MCP (Model Context Protocol).

## Transport

Streamable HTTP at:
```
https://joshbeckman--1818d72637f311f089f39e149126039e.web.val.run/mcp
```

## Tools

- `search_posts` — Full-text search across all posts and notes
- `get_post` — Retrieve a specific post by its URL path
- `get_tags` — List all content tags used on the site
- `search_tags` — Search for tags by keyword
- `get_tag_urls` — Get all post URLs associated with a tag
- `get_proverbs` — Get a random selection of collected proverbs
- `get_sequences` — List all research sequences
- `get_sequence` — Get posts in a specific research sequence

## Discovery

- MCP config: `https://www.joshbeckman.org/.well-known/mcp.json`
- Server card: `https://www.joshbeckman.org/.well-known/mcp/server-card.json`
- Site guide for LLMs: `https://www.joshbeckman.org/llms.txt`
