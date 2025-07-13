---
layout: Post
date: '2025-07-13 00:00:00 +0000'
title: Releasing gh-view-md - A GitHub CLI Extension for LLM-Optimized Issue and PR
  Viewing
toc: true
image: "/assets/images/ae2799ba-8cdd-4f60-a717-a78675ae8448.jpeg"
description: A new GitHub CLI extension that renders issues and pull requests in clean
  markdown format, perfect for feeding to LLMs or offline viewing
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114844317210566071
bluesky_status_url: 'false'
tags:
- tools
- llm
- language-ruby
- open-source
---


![A beautiful mountain view](/assets/images/ae2799ba-8cdd-4f60-a717-a78675ae8448.jpeg)

At work, I'm using LLMs to help analyze GitHub issues and pull requests - asking them to suggest next steps or implement features based on conversations. The problem? Getting that content into a format that's actually useful for LLMs has been tedious.

GitHub's web interface is great for browsing, but when you want to feed an issue or PR to an AI tool, you end up copying and pasting fragments, losing context, or fighting with formatting. The GitHub CLI's built-in viewing commands help, but they don't capture the full conversation flow that makes discussions meaningful (and they require many many tool calls to replicate the full context, *greatly* increasing latency).

So I built [gh-view-md](https://github.com/joshbeckman/gh-view-md) - a [GitHub CLI extension](https://docs.github.com/en/github-cli/github-cli/creating-github-cli-extensions) that fetches any GitHub issue or pull request and renders it as clean, comprehensive markdown.

## What It Does

```bash
gh view-md https://github.com/owner/repo/issues/123
# or
gh view-md https://github.com/owner/repo/pull/456
```

That single command gives you everything:

- Full issue/PR metadata (title, author, dates, status)
- The complete body content with HTML stripped
- All comments in chronological order with timestamps
- Timeline events (labels, assignments, state changes)
- For PRs: code diffs, review comments, commit history, and CI status
- Proper markdown formatting throughout

The output is structured and clean - perfect for piping to LLM tools, saving for offline review, or converting to other formats.

## Why I Built This

My workflow increasingly looks like this:
1. Find an interesting GitHub discussion
2. Want to understand it quickly or get AI analysis
3. Struggle to get the content in a usable format
4. Give up or spend too much time copying/pasting

The existing tools each solve part of this:
- `gh issue view` or `gh pr view` shows basic info but misses the conversation flow
- Copy/paste from the web loses formatting and context
- The GitHub MCP server requires multiple calls to get all comments and events, which is slow and error-prone

I wanted something that captured *everything* in a format that's both human and AI readable, in a single tool call I can give an LLM agent.

## Smart Features

Beyond just dumping content, `gh-view-md` includes several thoughtful touches:

**Link hydration**: Bare GitHub URLs in comments become proper markdown links with titles, so references to other issues stay meaningful.

**Image handling**: Org/owner private images and external images get downloaded locally and referenced properly in the markdown.

**Event grouping**: Related timeline events (like adding multiple labels) get grouped together to reduce noise.

**Diff limits**: Large PRs can have overwhelming diffs, so there's a `--max-diff` option to show just filenames when things get too big. (Or increase the limit if you want *more* diff.)

**Parallel processing**: The script fetches data concurrently to keep things fast.

## Real Use Cases

I'm already using this daily for:

**LLM analysis**: `gh view-md https://github.com/owner/repo/pull/456 | llm "Summarize this PR and identify any risks"`

**Documentation**: Creating offline copies of important design discussions or decision threads.

**Review prep**: Getting the full context of a PR before diving into detailed review.

**Reporting**: Generating markdown that can be converted to other formats for stakeholder updates.

## Technical Notes

The extension is written in Ruby (loving GitHub CLI's flexibility) and creates a temporary directory structure at `/tmp/gh_issue/` for downloaded images. It uses the GitHub API through the existing `gh` CLI authentication, so no additional setup is needed.

For large pull requests, the `--max-diff` parameter prevents overwhelming output by showing only filenames when diff content exceeds the threshold.

## Installation

```bash
gh extension install joshbeckman/gh-view-md
```

That's it. If you have the GitHub CLI installed and authenticated, you're ready to go.

The [source is on GitHub](https://github.com/joshbeckman/gh-view-md) with examples and full documentation. Contributions are welcome!
