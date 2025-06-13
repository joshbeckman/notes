---
layout: Post
date: '2025-06-13 02:54:27 +0000'
title: I Built an MCP Server for My Site
toc: true
image: "/assets/images/be179fb8-6147-4832-81f6-3f5d208be8c5.jpeg"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114674440968062198
bluesky_status_url: 'false'
tags:
- ai
- llm
- tools
- personal-blog
---


![gross wires and ethernet](/assets/images/be179fb8-6147-4832-81f6-3f5d208be8c5.jpeg)

After watching [the specification](https://modelcontextprotocol.io/introduction) build up this spring, I got around to building my own MCP server (for the posts on this site) a couple weeks ago. Since then I've been building agents on it and having a grand ol' time seeing how they explore and what they find, hidden in thousands of entries.

Setting up a server is trivially easy: you can get started in a couple dozen lines. I used the official TypeScript SDK so I could host it on [val.town](https://www.val.town) while I'm still experimenting.

## Tools

I recommend using the [Model Context Protocol Inspector](https://modelcontextprotocol.io/docs/tools/inspector) to interrogate and explore the tools you're building. As of today, these are the tools I've built for this site:

- `get_tags` for tags
- `get_post` for a post
- `search_posts` for [general search](/search)
- `get_proverbs` for [proverbs](/proverbs)
- `get_sequences` for [sequences](/sequences)
- `get_sequence` for a sequence
- `search_tags` for [tags](/tags)
- `get_tag_urls` for getting URLs for tags

<img width="574" alt="MCP Inspector showing tools" src="/assets/images/5253681a-8ffa-47d7-b32d-20798d9d87f0.png" />

### Things I Learned About MCP Tools

**Have every tool call return enough tokens to answer, _and no more_.**

You'll notice that I made a dedicated tool for getting URLs for tags. This is because I found, in experimenting with this MCP server with LLMS, that mostly I and the LLM just need to consider tags on their own ("what tags exist", "does this tag exist"), not the links to the tags. And since each tag is a single word, if the tag tool returns a list of tags with URLs it's returning _mostly_ URLs and not the actual tags. This causes a bunch of wasted tokens and compute.

**Make tool calls as fast as possible.**

In experimenting, I initially downloaded post data and built an in-memory search for every tool call. This was fast for prototyping but made each call take 2-3 seconds. In an agent loop, this caused response times to balloon rapidly. Currently, LLM agents largely have to execute tool calls _in sequence_ and every execution returns a result that must be fed back to the agent for another completion/transformation. So latency in tool calls _builds up rapidly_ and should be avoided. I refactored the MCP server to use a pre-built index and now every tool call is resolved in under a second.

## Resources

I haven't specified any [Resources](https://modelcontextprotocol.io/docs/concepts/resources) on the server, today. Resources are intended for use by the client application, to display things alongside LLM text/chat. I don't have a real need for that, yet; I'm building this MCP server for LLM access to my site's posts, not for displaying them in a chat/browser.

I'll probably add resources in the future, once they're supported by clients and more directly used. One interesting idea I've seen for resources is to hold pollable endpoints for long-running tool calls: call a tool that will kick off a long-running job, have the tool return a resource ID that the client can poll the server with to get the job result eventually.

## Prompts

Virtually no MCP LLM clients I know of are using [prompts](https://modelcontextprotocol.io/docs/concepts/prompts), so I haven't built them into my server for now.

## Discovery

This stuff is so early, I implemented a discovery mechanism based on [someone's phone snapshot of a presentation slide at a conference](https://github.com/orgs/modelcontextprotocol/discussions/84#discussioncomment-12287061). You can find it at [`/.well-known/mcp.json`](https://www.joshbeckman.org/.well-known/mcp.json).

## Setup & Usage

You can use the MCP server remotely by calling [`joshbeckman--1818d72637f311f089f39e149126039e.web.val.run/mcp`](https://joshbeckman--1818d72637f311f089f39e149126039e.web.val.run/mcp).

You can use the MCP server locally via [`mcp-remote`](https://github.com/geelen/mcp-remote#readme):

```bash
npx -y mcp-remote https://joshbeckman--1818d72637f311f089f39e149126039e.web.val.run/mcp
```

Please drop a line if you use it! Or if you have any suggestions on how to improve it.
