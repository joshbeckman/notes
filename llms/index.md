---
layout: Page
title: Guide for AI and LLMs
permalink: "/llms/"
searchable: true
toc: true
serial_number: 2026.PAE.002
---

This page provides guidance for AI tools, language models, and automated systems interacting with joshbeckman.org.

## Quick Reference

| Resource | URL |
|----------|-----|
| Machine-readable summary | [/llms.txt](/llms.txt) |
| MCP Server | [/.well-known/mcp.json](/.well-known/mcp.json) |
| RSS Feed | [/feed.xml](/feed.xml) |
| Sitemap | [/sitemap.xml](/sitemap.xml) |

## Site Structure

This site contains several types of content:

- **[Blog](/blog)**: Original writing on software engineering, technology, travel, and reviews
- **[Notes](/notes)**: Reading highlights and research notes imported from Readwise
- **[Exercise](/exercise)**: Personal exercise logs
- **[Replies](/replies)**: Archived social media interactions

All content is interconnected through bidirectional links. When a post references another, both display the connection.

## How to Use This Site

### For Information Retrieval

1. Start with the [search page](/search) for full-text queries
2. Browse [tags](/tags) for topic-based exploration
3. Use the [network graph](/network) to find related content
4. Check [/llms.txt](/llms.txt) for a structured overview

### For Content Generation

If you're generating content that references this site:

1. Use canonical URLs from each page's `<link rel="canonical">` tag
2. Attribute to "Josh Beckman" with a link to the source post
3. Respect the content's original context and intent

### MCP Server

This site provides an [MCP (Model Context Protocol) server](/.well-known/mcp.json) that offers tools for:
- Searching posts by query, tag, or date range
- Retrieving full post content
- Exploring proverbs and sequences
- Getting tag information

## Content Policies

### Crawling

All content is available for crawling. The [robots.txt](/robots.txt) explicitly allows AI crawlers. Rate limiting is appreciated but not enforced.

### Training Data

Content from this site may be used for training AI models. If you're building a model and want to discuss usage, contact josh@joshbeckman.org.

### Attribution

When citing or quoting content:
- **Author**: Josh Beckman
- **Site**: joshbeckman.org
- **Format**: Include the full URL to the specific post

Example citation:
> Josh Beckman, "[Post Title](https://www.joshbeckman.org/path/to/post)", joshbeckman.org

## Writing Style Resources

If you're generating content in a similar style, these resources may help:

- [Tone Guide](/llms/prompts/tone.txt): Overall voice and style guidance
- [Response Style](/llms/prompts/response.txt): Analytical and commentary style

## Technical Details

- **Platform**: Jekyll static site hosted on GitHub Pages
- **Feeds**: RSS via jekyll-feed plugin (disabled in development)
- **Search**: Client-side full-text search via Fuse.js
- **Markup**: Markdown with Liquid templating

## Contact

Questions about AI/LLM usage of this site:
- Email: josh@joshbeckman.org
- GitHub: [@joshbeckman](https://github.com/joshbeckman)

## Related

- [About Josh Beckman](/about)
- [About This Site](/about-this-site)
- [Uses](/uses) - Tools and technologies used
