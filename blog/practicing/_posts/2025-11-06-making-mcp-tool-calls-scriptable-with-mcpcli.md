---
layout: Post
date: '2025-11-06 14:15:22 +0000'
title: Making MCP Tool Calls Scriptable with mcp_cli
toc: true
image: "/assets/images/f4041c35-1df5-42a4-ac64-2a2ac880ee48.jpeg"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115503266427766115
bluesky_status_url: false
tags:
- llm
- tools
- open-source
- automation
- language-ruby
serial_number: 2025.BLG.172
---
![The fall colors in my yard are dazzling me this week](/assets/images/f4041c35-1df5-42a4-ac64-2a2ac880ee48.jpeg)

I will often explore a solution or script with an LLM agent (e.g. Claude Code) for a while. I'll iterate on ways to extract data from the current codebase and use that to call MCP server tools, eventually getting to something I'd like to run regularly.

For example, I might want to pull all the recent errors for the application (queried from logs exposed by MCP server tools) and correlate them to find problematic areas of the codebase. In exploring this, the LLM agent can get me to an answer, but the program of getting there is locked and woven away inside the conversation history with the agent.

Increasingly, I've been wanting to extract a final executable script from conversations like these, so I can run them again later without needing to re-engage the LLM agent. I've found that asking the agent to produce a final script at the end of the conversation is often unsatisfactory, as it may not capture all the nuances of the exploration and often key data or functionality is hidden away behind an MCP server tool call that the agent made during the conversation. As I've written about [the hidden cost of human-centric tools in LLM workflows](https://www.joshbeckman.org/blog/practicing/the-hidden-cost-of-humancentric-tools-in-llm-workflows), we're constantly reconsidering the tools offered to LLM agents and finding ways to make them more efficient.

This is where tooling can bridge the gap.

> [!NOTE]
> [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) is a standard for connecting LLM agents to external data sources and tools. MCP servers expose "tools" that agents can call - like searching your notes, querying logs, sending emails, etc. When you use Claude Code or Cursor, they're calling MCP server tools behind the scenes.

## The `mcp_cli` Tool

To better support scripting over MCP server tools like this, I've open-sourced a tool I've been using: [`mcp_cli`](https://github.com/joshbeckman/mcp_cli). It's simply a CLI for calling and interacting with MCP (Model Context Protocol) servers.

You can use `mcp_cli` to call MCP server tools directly from the command line, passing in inputs and receiving outputs in a structured way. This allows you to extract the core logic of your LLM agent explorations into standalone scripts that can be run independently.

For example, instead of asking an LLM agent "search my notes for posts about MCP", you can now run:

```bash
gem exec mcp_cli call josh-notes search_posts \
  --query "MCP" \
  --limit 5 | jq '.[] | .text'
```

This returns structured JSON that you can pipe to other tools like `jq` to extract just the text content, save to a file, or process in a script.

You can use `mcp_cli` to:
- Call MCP server tools directly from the command line
- Explore and test MCP server tools and prompts without needing an LLM agent
- Extract and save the logic of your LLM agent explorations into reusable scripts
- Automate regular tasks by scripting MCP server tool calls
- Build [your own jigs](https://www.joshbeckman.org/notes/487680878) and script for LLM agents to use instead of relying on the agent to figure out MCP server tool sequences

> [!NOTE]
> [Read the `mcp_cli` README for installation and usage instructions](https://github.com/joshbeckman/mcp_cli/blob/main/README.md#quick-start-no-installation) and usage examples. But the simplest way to get started is to use `gem exec` (no installation required): `gem exec mcp_cli --help`.

This tool builds on two of my recent enthusiasms: [MCP tool calls are just cURL calls](https://www.joshbeckman.org/blog/practicing/dont-forget-remote-mcp-servers-are-just-curl-calls), and [the `gem exec` pattern for fast distribution of Ruby CLI tools](https://www.joshbeckman.org/blog/practicing/the-gem-exec-command-gives-me-hope-for-ruby-in-a-world-of-fast-software).

It's trivial to expose MCP server tools to any program because most can be translated into a simple HTTP request or Bash command. That's essentially what `mcp_cli` does, along with some niceties around detecting MCP configuration you've set up for major LLM agent/editor platforms (Claude, Cursor, etc). And it can do it with _zero dependencies_ beyond Ruby itself.

You _could_ just use `cURL` directly to call MCP server tools, but `mcp_cli` makes it quite a bit more user-friendly and easier to integrate into scripts. It also makes it trivial to explore MCP server tools interactively from the command line, which is great for prototyping and testing.

The `gem exec` pattern means you can run `mcp_cli` without installation - just like `npx` or `uvx`. In this new world of fast-software where LLM agents generate and run code on the fly, I want Ruby to compete with Python and JavaScript for instant execution. Ruby remains a lovely language for building succinct, readable software, and `gem exec` gives it the same distribution speed.

## The Dream

I keep daydreaming of a near future where I have a lengthy conversation with an LLM agent to explore a solution, and at the end of it, I can say "export this as a script" and get back a fully functioning script that uses `mcp_cli` calls to replicate the logic we explored together. This script could then be run independently, scheduled to run regularly, or even shared with others to use. It's a jig that guarantees the same behavior as the LLM agent exploration, but without needing to re-engage the agent each time. It's faster, more efficient, and more reliable.

This directly enables what Anthropic recently described in [code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp): combining multiple MCP tool calls into scripts to reduce context usage, latency, and cost. Where they show TypeScript examples requiring execution infrastructure, `mcp_cli` makes this immediately practical with bash pipes and standard CLI patterns. An agent can compose multiple MCP operations into a single script that processes data through pipes rather than through the model's context window - achieving the same efficiency gains without additional infrastructure.

For example, Anthropic shows fetching a document from Google Drive and attaching it to a Salesforce record. With `mcp_cli`, that becomes:

```bash
# Fetch transcript and pipe directly to Salesforce without going through model context
gem exec mcp_cli call gdrive getDocument --documentId "abc123" \
  | jq -r '.content' \
  | gem exec mcp_cli call salesforce updateRecord \
      --objectType "SalesMeeting" \
      --recordId "00Q5f000001abcXYZ" \
      --data "$(cat -)"
```

The full transcript flows through the pipe, never entering the model's context window. For a 2-hour meeting transcript (potentially 50,000 tokens), this approach saves those tokens from being processed twice.

Here's another contrived example:

**Before:** A 20-message conversation with Claude Code:
> "Can you find all my blog posts about MCP from the last month?"
> *Claude searches notes, filters by date, formats results...*
> "Now check which ones mention security concerns"
> *Claude filters further...*
> "Great, now send me a summary via email"
> *Claude composes and sends...*

**After:** A 5-line bash script I can run anytime:
```bash
#!/bin/bash
gem exec mcp_cli call josh-notes search_posts \
  --query "MCP" --category "blog" --startDate "2024-10-01" \
  | jq '.[] | select(.text | contains("security")) | .text' \
  | gem exec mcp_cli call josh-beckman-status send_email_to_josh \
      --subject "MCP Security Posts" --body "$(cat -)" --from "mcp_script"
```

That's what I'm working on next.
