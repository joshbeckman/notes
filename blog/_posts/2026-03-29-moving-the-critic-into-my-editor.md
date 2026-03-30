---
layout: Post
date: 2026-03-29 21:46:00
title: "Moving the Critic Into My Editor"
description: "What if you could have an AI critic semantically linting your writing, inline?"
tags:
  - ai
  - writing
  - tools
  - vim
  - feedback
category: practicing
toc: true
---

I was editing [the blog post about my AI writing critic](/blog/practicing/three-agents-for-a-knowledge-garden) (based on the critique it had generated) when I realized I didn't want to be incorporating this feedback *after* I had already published; I wanted the next critique now, against the draft in front of me.

The [Critic agent](/blog/practicing/three-agents-for-a-knowledge-garden#the-critic-walks-beside) I built runs on a cron schedule. It monitors my RSS feed, reads new posts, searches my garden for related writing, and emails me a critique. That's good for reflection. I read the critique over coffee the next morning, think about it, sometimes update the post. But it means publishing first and polishing later. For a post I cared about getting right before it went out, I wanted the feedback loop tighter.

## Bring the feedback to the source

Feedback is more useful the closer it is to the action. An email critique that arrives hours later is a thought-provoker, [only affecting future behavior](https://www.joshbeckman.org/notes/692534908). A critique that appears inline against your prose, while you're still shaping it, is a collaborator. I wanted something [like inline semantic linting](https://www.joshbeckman.org/notes/888705369).

I already had the infrastructure: the Critic val on [Val Town](https://val.town), the Anthropic API, the garden search tools. I needed two things: a way to critique unpublished drafts, and a way to see the results in my editor.

## The `:Critique` command

I added a `POST /draft` endpoint to the [Critic val](https://www.val.town/x/joshbeckman/criticCron) that accepts a title and content (password-protected), runs the same critique pipeline, and returns the result. Then I [wired it into a neovim command](https://github.com/joshbeckman/dotfiles/blob/a1eeebd11c81c86abf167f8b82c863fd180fdb7e/.config/nvim/init.vim#L347):

```vim
:Critique
```

The command runs asynchronously via `jobstart()` (I get my editor back immediately). About a minute later, two things happen: the full critique opens in a background tab, and inline annotations appear in my buffer via [ALE](https://github.com/dense-analysis/ale).

> [!NOTE]
> If you're not familiar with ALE and/or [neo]vim, think of these inline annotations as the squiggly spellchecker lines you see in your Microsoft Word and Google Docs.

![Here's how the critique linter displays in my (neo)vim editor](/assets/images/critique-ale-display.png)

The annotations use ALE's `other_source` API, which lets you push linter-style results from any external process. Each annotation has a line number, a severity (`I` for suggestions, `W` for clarity issues, `E` for errors), and a short message. When the feedback targets a specific phrase, ALE highlights just those words rather than the whole line.

With this, I can navigate around the file and read the feedback inline, or `:lopen` the location list window to view all of them at once. Or I can tab to the full-prose critique and see the full context from the critic. In practice, I do all these things and then revise, rinse, and repeat.

The annotation step is deliberately separate from the critique step. The Critic agent has a single job: read the post, research the garden, write a critique in prose. A second, cheaper call maps that prose onto line numbers and phrases. The separation matters for several reasons:

- I have a hunch that the critique agent produces better output when it's not distracted by linter formatting
- The critique stays useful as standalone prose; it's not locked to a display format
- The annotation mapping is composable: I can map any critique-and-source pair, not just ones the Critic generated
- I can use different model tiers for each: Opus for the critique, Sonnet for the mapping

## Two resolutions of the same feedback

Seeing the critique at two resolutions simultaneously changed how I process it.

The full critique in the background tab gives me the arc: what's working, what's missing, how the piece connects to my other writing. The inline annotations give me specific pressure against specific sentences. I read the tab first to understand the big picture, then work through the inline feedback phrase by phrase.

This also taught me to edit in phases. Saving the file clears the ALE annotations (the linter display is tied to the buffer state), so I make several edits before saving. That batch-editing rhythm turns out to be better anyway; I'm responding to a coherent set of feedback rather than fixing things one at a time.

The async email critic still runs for every published post. It's more of a thought-provoker, and only sometimes pushes me to update something. The inline critic, because it's right there next to my words, makes me edit more. Proximity matters.

## Agents write to me, I edit my own files

A principle I'm finding: agents should communicate *to* me, not edit over my work. Code is now an agent's artifact. The critique is the agent's artifact. Whatever I'm writing is mine: my thinking, possibly refined by the agent's interrogation. A linter never rewrites your code; it tells you what to reconsider. The Critic works the same way.

## How it works

The Critic val now has three relevant endpoints:

- `POST /draft` - accepts `{title, content}`, runs Sonnet for research (searching the garden, reading linked sources) and Opus for the final critique. Returns the critique as markdown and HTML.
- `POST /annotate` - accepts `{content, critique}`, uses Sonnet to map each critique point to a line number, severity, and optional verbatim phrase from the source. Returns a JSON array of annotations.
- `GET /cron` - the original: processes new RSS entries and emails critiques.

The neovim `:Critique` command chains `/draft` and `/annotate` asynchronously. It writes the critique to `/tmp` (so it's automatically cleaned up), opens it in a background tab, then pushes annotations to ALE. The phrase-to-column resolution happens in vimscript: if the annotation includes a phrase, `stridx()` finds it on the target line and sets `col`/`end_col` for precise highlighting.

The Sonnet-for-research, Opus-for-critique split was originally a performance optimization - the val was timing out on Val Town's free tier. It turned out to be the right architecture regardless. No noticeable difference in critique quality, meaningfully faster, and cheaper.

## What's next

The composable annotation endpoint opens other possibilities. Any document paired with any feedback (from an agent or a human) could be mapped to inline annotations: code review comments against a diff, editor notes against a manuscript, study questions against a reading. The pattern generalizes beyond my specific critic.

For now, though, the main thing is simpler: I write drafts, I `:Critique` them, and I make more edits because the feedback is right there. The agents write to me. I write my own prose.
