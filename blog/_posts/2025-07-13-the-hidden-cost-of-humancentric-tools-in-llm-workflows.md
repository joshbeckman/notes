---
layout: Post
date: '2025-07-13 15:28:47 +0000'
title: The Hidden Cost of Human-Centric Tools in LLM Workflows
image: "/assets/images/c27d3253-ff59-419c-9d5f-b055bb857167.jpeg"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114847135889506262
bluesky_status_url: 'false'
tags:
- tools
- llm
- optimization
---


![Vines growing on telephone wires](/assets/images/c27d3253-ff59-419c-9d5f-b055bb857167.jpeg)

I built and [released `gh-view-md`](https://www.joshbeckman.org/blog/releasing-ghviewmd-a-github-cli-extension-for-llmoptimized-issue-and-pr-viewing) because I think we're entering an important phase of LLM development: tool refactoring and script extraction.

As you build LLM interfaces and agent-powered features, you'll quickly discover something important: *offering* tools to your LLM can get you a working solution, but your first version will likely be inefficient. Multiple tool calls. Excessive tokens. Extended processing time. Failure modes where the right tools weren't called to provide the right context.

Because today's starting-point data and tools are built for humans clicking through web browsers, not LLMs operating on pure text and image I/O.

## The Problem: Tools Designed for Mouse Hovers, Not Machine Readers

Take GitHub as an example. They offer an excellent MCP server suite of tools for viewing issues, but they're fragmented across different endpoints and UI interactions:

- One tool call for the basic issue title and body
- Another for fetching comments
- Another for timeline events
- Several more for linked pull requests
- And so on...

Additionally, the web UI enriches text in ways that are invisible to LLMs. When you see "solved by #34" in an issue, hovering reveals the full issue title and context. Your LLM? It just sees "#34" and misses context that could inform its decisions.

This fragmentation isn't accidental. As we know: "Your choice of data layout/structure has two consequences: [it makes invariants easier to enforce and it makes operations easier](https://www.joshbeckman.org/notes/501639267)." GitHub's data structure makes sense for human browsing patterns—progressive disclosure, interactive exploration. But it makes LLM operations harder.

## A Real-World Example: Bug Triage at Scale

This week at work, I built an LLM agent orchestration system to triage bugs in GitHub issues. The workflow (built my my own human experience _and_ tool exploration with LLM) required:

- Fetch issue details
- Search for related prior conversations
- Retrieve relevant logs and stack traces
- Pull analytics data
- Check linked PRs and their status
- Generate a triage recommendation

The first implementation had room for improvement:

**Cost per issue:** $5  
**Time per issue:** 5 minutes  
**Tool calls per issue:** 15-20

Then I rebuilt the prompt/workflow and replaced the standard GitHub issue viewing tool guidance with `gh view-md`.

**Result:** 10-20% reduction in both cost and latency per issue  
**Why:** One comprehensive tool call replaced multiple fragmented ones and context was never missed

This isn't just about GitHub or my specific tool. It's a pattern I'm seeing everywhere as we integrate LLMs into production workflows:

> We're constantly reconsidering the tools offered to LLM agents, finding inefficiencies, and rebuilding them into fewer tools that provide more context with less overhead.

The human-centric design that makes tools great for us (progressive disclosure, interactive elements, etc.) makes them less optimal for LLMs that need comprehensive context in a single pass.

I discovered similar principles when [building my site's MCP server](https://www.joshbeckman.org/blog/i-built-an-mcp-server-for-my-site).

## What This Means for 2025-2026

I believe we're entering a key phase in LLM agent development. Through the end of 2025 and into early 2026, we'll be:

**1. Extracting the scriptable** - Recognizing which LLM tasks don't require creative transformation and can be pre-computed or condensed into faster, cheaper, repeatably consistent operations. I'm currently trying to build a framework for doing this.

**2. Abstracting MCP tools** - Creating workflow-specific tools that minimize round trips to lower cost and latency and error rate.

As always, great gains can be found in [making tools specific to the job](https://www.joshbeckman.org/notes/546207525).

## The Path Forward

If you're building LLM-powered features, start auditing your tool usage:

- Count how many tool calls it takes to gather context for a decision
- Look for patterns where multiple calls could be consolidated
- Identify where UI enrichment leaves your LLM blind

The gains compound quickly. That 10-20% improvement from one tool change? Apply similar optimizations across your entire workflow and you might cut costs and latency in half.

*How are you dealing with similar inefficiencies in your LLM agents? What tools are you using to refactor for better agent performance?*

