---
layout: Post
date: '2025-07-18 20:16:04 +0000'
title: Telling Claude Code Who I Am
toc: true
image:
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114876165756284942
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lubck77yee2w
tags:
- llm
- code-snippets
---


Added this to my `~/.claude/CLAUDE.md` yesterday to work better across work/personal machines and help claude (and other LLM agents) understand me when I speak in first person:

```md
## Who I (the user) am
I am Josh Beckman (more info at https://www.joshbeckman.org/about).
My GitHub username is @!`git config github.user` and my email address is !`git config user.email` and commits/comments attributed to those are from me.
My main text editor is !`git config core.editor`.
```

This uses [bash command execution syntax](https://docs.anthropic.com/en/docs/claude-code/slash-commands#bash-command-execution) which isn't _technically_ supported in the base `CLAUDE.md` but the agents figure it out well enough and I think it'll get supported in the future.
