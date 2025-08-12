---
layout: Post
date: '2025-08-12 17:18:45 +0000'
title: My Markdown Preview Utility
toc: true
image: "/assets/images/83488d01-ae66-42c1-bcaf-2b2e01cff096.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115017020104107179
bluesky_status_url: 'false'
tags:
- code-snippets
- vim
- tools
- llm-prompts
---


Please take your last response and pass it directly to the `preview-md` command as a string argument for visual preview.

Do this by:
1. Taking the full content of your previous response
2. Running the command: `preview-md "YOUR_LAST_RESPONSE_AS_MARKDOWN"`

Make sure to:
- Escape any double quotes in the content with \"
- Preserve all markdown formatting (headers, lists, code blocks, links, etc.)
- Include any code blocks with proper language identifiers
- Keep all line breaks and whitespace

Just run the command directly without explanation.
```

So I can now run `/preview-md` in any Claude conversation and view the LLM's response nicely formatted.

<img width="520" height="271" alt="Example rendered LLM response" src="/assets/images/83488d01-ae66-42c1-bcaf-2b2e01cff096.png" />
