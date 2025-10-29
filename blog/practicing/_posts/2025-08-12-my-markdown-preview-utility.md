---
layout: Post
date: '2025-08-12 17:18:45 +0000'
title: My Markdown Preview Utility
toc: true
image: "/assets/images/83488d01-ae66-42c1-bcaf-2b2e01cff096.png"
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115017020104107179
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lw7u7g6kqm2e
tags:
- code-snippets
- vim
- tools
- llm-prompts
serial_number: 2025.BLG.131
---
I write a lot of [markdown](https://www.markdownguide.org/) and I am delivered a lot of markdown, increasingly from LLM agents. And while markdown is easy to read inline, often I want a preview of how it will render or maybe I just need to take a nice screenshot for a presentation to the CTO later or maybe I just want to read the long LLM output in a proportional font.

So I've been increasingly using the command line script (stored in `bin/preview-md`) that I wrote a while ago:

```sh
#!/bin/bash

if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    echo "preview-md - Preview markdown as HTML in your browser"
    echo ""
    echo "Usage: preview-md [FILE]"
    echo "       preview-md \"STRING\""
    echo "       command | preview-md"
    echo "       preview-md < file.md"
    echo ""
    echo "Reads markdown from stdin, a file, or a string argument and opens it as HTML in your browser."
    echo "Uses pandoc to convert GitHub Flavored Markdown to HTML."
    exit 0
fi

if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed." >&2
    echo "Please install pandoc to use this tool:" >&2
    echo "  macOS: brew install pandoc" >&2
    echo "  Ubuntu/Debian: sudo apt-get install pandoc" >&2
    echo "  Other: https://pandoc.org/installing.html" >&2
    exit 1
fi

timestamp=$(date +%Y%m%d_%H%M%S)
tmpfile="/tmp/preview-md-${timestamp}-$$.html"

# Add cleanup trap to remove tmpfile after browser opens
trap "sleep 5; rm -f '$tmpfile'" EXIT

echo '<link href="https://www.joshbeckman.org/assets/css/site.css" rel="stylesheet"><style>body { max-width: 800px; margin: 1em auto; padding: 1em; font-family: "IBM Plex Sans", sans-serif; }</style>' > "$tmpfile"

if [[ $# -eq 1 ]]; then
    if [[ -f "$1" ]]; then
        pandoc -f gfm -t html "$1" >> "$tmpfile"
    else
        echo "$1" | pandoc -f gfm -t html >> "$tmpfile"
    fi
else
    pandoc -f gfm -t html >> "$tmpfile"
fi

open "$tmpfile"
```

This little script allows you to pipe a file or string output or just give it a file path and it will use [pandoc](https://pandoc.org/) to render an HTML page and open it in your browser for you. Beautifully flexible.

I have it rendering the HTML with my own site's CSS because I like that style and specifically [those fonts](https://www.joshbeckman.org/blog/my-favorite-fonts), but you can remove that by simplifying this line:

```sh
echo '<style>body { max-width: 800px; margin: 1em auto; padding: 1em; font-family: sans-serif; }</style>' > "$tmpfile"
```

## In Vim

Since this script is so flexible, I've hooked it up in a few key places. For one, I have a (Neo)vim command to open the current buffer as a markdown preview:

```vim
command! PreviewMd call PreviewMarkdown()

function! PreviewMarkdown()
    let filepath = expand("%:p")
    execute "!preview-md " . shellescape(filepath)
endfunction
```

## In Claude

And I also have made a [Claude slash command](https://docs.anthropic.com/en/docs/claude-code/slash-commands) to have the LLM agent render its last message to me as a markdown preview in the browser:

```md
---
description: Preview Last Response as Markdown
allowed-tools: Bash(preview-md:*)
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
