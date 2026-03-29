---
layout: Post
date: 2026-03-26 09:40:00.000000000 +00:00
title: Three LLM Agents for My Knowledge Garden
description: 'I built three AI agents that tend my knowledge garden in different ways:
  one walks in front, one walks behind, and one walks beside me.'
tags:
- ai
- writing
- tools
- open-source
- personal-blog
mastodon_social_status_url: https://mastodon.social/@joshbeckman/116297433511859354
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3mhyhxzycyb23
category: practicing
toc: true
image: "/assets/images/critic-cron-email-screenshot.png"
serial_number: 2026.PTG.001
---
I was lifting weights when I realized my notes had gotten lazy. Long quotes, short thoughts, no connections drawn. I'd saved a quote about the laziness of forwarding raw AI output and left [no thoughts of my own about it](https://www.joshbeckman.org/notes/997876311). I was hoarding links instead of digesting them.

I've been building [this knowledge garden](/blog/opening-up-my-highlights-notes) for years, and the collection has grown to thousands of notes, blog posts, highlights, and replies. I know the latent connections between them are there, but tracing the threads takes work. I usually write from personal experience and prior reading/writing, but want to include actual links to relevant work. Additionally, I don't always remember prior work that would contradict or inform my current thinking. Having someone check for those things would help me improve.

So I've been building agents to push my critical thinking and tend the garden alongside me. Three of them now, each with a different role.

## The Pre-Reader walks in front

I built [Pre-Read](/pre-read) to help me figure out whether I have an opinion on a piece. It can help before diving into a long article someone sent me or that I found in my feed. I give it a URL and it searches my garden for things I've already written or saved that might relate to the piece. It frames what I already know before I start reading.

This is useful when I haven't quite solidified my opinion on something. The pre-reader jogs loose some thoughts I can then maybe turn into a note. It walks ahead of me on the trail, scouting what's familiar.

It produces three perspectives on any given piece: a *Proponent*, an *Opponent*, and a *Questioner*. These mirror how I naturally read things. I usually give an author the benefit of the doubt first — I agree, I look for where it reinforces what I already believe. Then I force myself to take the opposing stance and poke holes in the argument. And when I'm really stuck, I try to think of questions for the author that would open up a better conversation around the topic. The three personas externalize that cycle so I don't get stuck on step one, which is what happens when I'm just saving a quick note.

## The Suggester walks behind

There are already hundreds of notes here that I've neglected to write about. I built an [Uncommented Notes](/uncommented/) page that surfaces them - notes where I saved a quote or a link but never added my own thoughts. From there, the [Suggest Comments](/suggest/) page takes any post and generates suggested comments I might add: connections to other posts, reactions I haven't articulated, threads I haven't pulled. Each suggestion comes as a short paragraph with markdown links to related garden posts.

This gives me a starting point to write my own expansion on the note. I don't want to copy and paste this output mechanically: the point here is to kickstart my own thinking and put my own words into the system.

These are tools for downtime. On the train, waiting in line - I open the uncommented list, pick a note, and let the suggester stimulate a thought. It helps me fill in blanks productively, which is better than scrolling social media. It walks behind me, picking up what I dropped.

The suggester uses the same three personas (Proponent, Opponent, Questioner) applied to my own posts instead of someone else's. The same reading cycle works in reverse: where do I agree with my past self, where would I push back now, and what questions does the note leave open?

## The Critic walks beside

The newest agent is the one I'm most excited about. The [Critic](https://www.val.town/x/joshbeckman/criticCron) runs on a cron schedule every few hours. It monitors my site's [RSS feed](/subscribe), and when I publish something new (a blog post, a note, an exercise log, anything) it reads the post, follows any linked sources (both internal garden links and external pages), searches the garden for related prior writing, and emails me a critique.

It's a simplistic agent. It's not constantly expanding its context scope, so it doesn't [fall prey to compounding error rates](https://www.joshbeckman.org/notes/916587771). This simplicity is a deliberate design choice for this tool. LLMs perform well in this sweet spot where they're given a tight context window, allowed to agentically operate in that window, and then state is output/saved for recursive processing.

> [!NOTE]
> The critic doesn't retain memory of past critiques or track whether I acted on its feedback. That compounding memory might be a future improvement, to make it a [full entity](https://www.joshbeckman.org/notes/922122090).

The critique covers argument strength, writing clarity, connections to other posts, how I engaged with sources, and growth edges. It's constructive, specific, and it cites passages. It walks beside me: it reads what I've just written, and later that day or the next morning over coffee I read a critique as if from a colleague. I consider it and hopefully incorporate it into an edit or a follow-on post. I want it to feel collaborative: [a feedforward mechanism](https://www.joshbeckman.org/blog/practicing/feedforward-tolerance-feedback-improving-interfaces-for-llm-agents) for my own writing process.

![Critic cron email for an exercise post](/assets/images/critic-cron-email-screenshot.png)

I chose a strong model for this (Anthropic's Opus). The other agents use Sonnet, which is fast and good enough for search-and-suggest work. But I want a writing mentor to be as sharp as possible. Lower-quality models still sound like parrots, echoing your context window back at you and telling you what you want to hear. I want genuine pushback. The critic runs infrequently enough that the cost is not a concern.

## Early results

I've been using the suggester for a few days now, and every day I've updated at least one note with new comments and links. I'm finding myself using the pre-reader on my backlog of reading - things I would have skimmed in the past, but now I can see them through the lens of what I've already written. I'm already getting ideas for how the pre-reader could evolve: giving it more agency to recommend whether I should read the full piece or not, pulling quotes into its summaries.

The critic is newest, but the first critiques have been pointed enough that I'm optimistic. I used it repeatedly on this very post and it pushed me to refine wording, expand things I only gestured toward, and found source links to support my words. It also challenged some of my earlier claims, so that I strengthened them or removed them. It has made me engage much more than I would have previously with this writing.

![Here's the critic critiquing this post as I wrote it](/assets/images/critique-of-critique-post.png)

Importantly, I'm *not* copying and pasting the output from these agents, or letting them edit my writing directly. I want *influence* and collaboration, not delegation (feedforward context that shapes environment, not writing output for me). Unlike how I'm using agents to write code on my behalf, I want to be writing this prose myself. I need to actually write things, [as output, to have them fully change my thinking](https://www.joshbeckman.org/notes/724851287). Code was always an intermediary between the system and behavior I was designing and the computer that would enact it, so with coding agents I operate at a system design level, now rarely editing lines of code directly. With prose, I communicate directly with the minds of the audience, and the writing is a [tool for my own mind](https://www.joshbeckman.org/notes/429253538); having an agent write it on my behalf cheats myself (see the SloppyPasta source at the top).

## A modern website

Any one of these agents is a neat trick, but together, they're something more: a living feedback loop built into my reading and writing on this site. The pre-reader prepares me before I read. The suggester fills in gaps when I have spare attention. The critic holds me accountable after I publish. A modern blogging website in this age of LLM agents should have AI feedback loops like these built in. I think this is the prose writing equivalent of my claude code software writing feedback loops.

This has been an evolution based on experience, not theory. The three agents replace the [Insight widget](https://www.joshbeckman.org/blog/upgraded-insight-widget-with-mcp-server) I built last year (and [the prior RAG-based insights before that](https://www.joshbeckman.org/blog/using-an-llmand-rag-to-wring-insights-from-my-posts)), which tried to do everything in one pass.

Using the basic RAG, I eventually found it uncreative. Using the agent, I found two distinct needs: suggesting connections and critiquing writing. Splitting them into dedicated agents with different triggers and interaction patterns serves each need better. It's also now trivially easy to manage many vals for many distinct purposes when LLM agents are doing the coding, testing, and development for me.

I don't want to just collect and hoard links. I want to integrate, connect, and digest. I can do that in conversation with colleagues, but I can't always find a sparring partner at the moment I need one. These agents are tireless, and they know my entire body of work. They fill the gaps between conversations, keeping the garden tended when I'm not paying attention.

## How the Critic works

The whole thing is built on [Val Town](https://val.town), which has become my go-to for this kind of lightweight agent infrastructure. It encourages small compositional units, exposes a nice CLI for managing things, supports email/HTTP/cron as agent triggers, has minimal-but-complete storage, etc. The stack:

- **RSS feed parsing** to detect new posts
- **Blob storage** to track the last processed post and avoid duplicates
- An **agentic tool-use loop** where the LLM can search my garden via [the MCP server I built for this site](/blog/i-built-an-mcp-server-for-my-site), read specific posts, and fetch external pages via [jina.ai](https://jina.ai/)
- **HTML email** with the critique, sent via Val Town's built-in email service
- **HTTP routes** for ad-hoc testing — a `/preview?url=` endpoint that renders the critique as a web page

I built each interface by orchestrating [Claude Code](https://docs.anthropic.com/en/docs/claude-code) agents. I [designed a skill](https://github.com/joshbeckman/dotfiles/tree/master/.claude/skills/val-town-dev) for them to know how to create and manage vals on Val Town. They tested and iterated using the [Chrome DevTools MCP server](https://github.com/anthropics/anthropic-cookbook/tree/main/anthropic-mcp-client/chrome-devtools-mcp) to render the pages in real time.

All of the source code is public. The [Critic](https://www.val.town/x/joshbeckman/criticCron), [Pre-Reader](https://www.val.town/x/joshbeckman/preRead), and [Suggester](https://www.val.town/x/joshbeckman/suggestComments) vals are on Val Town. The [Val Town dev skill](https://github.com/joshbeckman/dotfiles/tree/master/.claude/skills/val-town-dev) for Claude Code is on GitHub. If you have a site with an RSS feed and a search index, you could wire up something similar.
