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

I've been building [this knowledge garden](/blog/opening-up-my-highlights-notes) for years, and the collection has grown to thousands of notes, blog posts, highlights, and replies. The latent connections between them are there - I can feel them, I carry them - but tracing the threads takes work. Finding the right post's URL, copying it, editing the note to include it. It's cumbersome enough that I often don't bother, and the links that would show the connections never get made.

So I've been building agents to push my critical thinking and tend the garden alongside me. Three of them now, each with a different role.

## The Pre-Reader walks in front

I built [Pre-Read](/pre-read) to help me figure out whether I have an opinion on a piece. It can help before diving into a long article someone sent me or that I found in my feed. I give it a URL and it searches my garden for things I've already written or saved that might relate to the piece. It frames what I already know before I start reading.

This is useful when I haven't quite solidified my opinion on something. The pre-reader jogs loose some thoughts I can then maybe turn into a note. It walks ahead of me on the trail, scouting what's familiar.

It produces three perspectives on any given piece: a *Proponent*, an *Opponent*, and a *Questioner*. These mirror how I naturally read things. I usually give an author the benefit of the doubt first — I agree, I look for where it reinforces what I already believe. Then I force myself to take the opposing stance and poke holes in the argument. And when I'm really stuck, I try to think of questions for the author that would open up a better conversation around the topic. The three personas externalize that cycle so I don't get stuck on step one, which is what happens when I'm just saving a quick note.

## The Suggester walks behind

There are already hundreds of notes here that I've neglected to write about. I built an [Uncommented Notes](/uncommented/) page that surfaces them - notes where I saved a quote or a link but never added my own thoughts. From there, the [Suggest Comments](/suggest/) page takes any post and generates suggested comments I might add: connections to other posts, reactions I haven't articulated, threads I haven't pulled. Each suggestion comes as a short paragraph with markdown links to related garden posts, ready to copy into the note.

These are tools for downtime. On the train, waiting in line - I open the uncommented list, pick a note, and let the suggester propose what I might say about it. It helps me fill in blanks productively, which is better than scrolling social media. It walks behind me, picking up what I dropped.

The suggester uses the same three personas (Proponent, Opponent, Questioner) applied to my own posts instead of someone else's. The same reading cycle works in reverse: where do I agree with my past self, where would I push back now, and what questions does the note leave open?

## The Critic walks beside

The newest agent is the one I'm most excited about. The [Critic](https://www.val.town/x/joshbeckman/criticCron) runs on a cron schedule every few hours. It monitors my site's [RSS feed](/subscribe), and when I publish something new (a blog post, a note, an exercise log, anything) it reads the post, follows any linked sources (both internal garden links and external pages), searches the garden for related prior writing, and emails me a critique.

The critique covers argument strength, writing clarity, connections to other posts, how I engaged with sources, and growth edges. It's constructive, specific, and it cites passages. It walks beside me: it reads what I've just written, and later that day or the next morning over coffee I read a critique as if from a colleague. I consider it and hopefully incorporate it into an edit or a follow-on post. I want it to feel collaborative.

![Critic cron email for an exercise post](/assets/images/critic-cron-email-screenshot.png)

I chose a strong model for this (Anthropic's Opus). The other agents use Sonnet, which is fast and good enough for search-and-suggest work. But I want a writing mentor to be as sharp as possible. Lower-quality models still sound like parrots, echoing your context window back at you and telling you what you want to hear. I want genuine pushback. The critic runs infrequently enough that the cost is not a concern.

## Early results

I've been using the suggester for a few days now, and every day I've updated at least one note with new comments and links. I'm finding myself using the pre-reader on my backlog of reading - things I would have skimmed in the past, but now I can see them through the lens of what I've already written. I'm already getting ideas for how the pre-reader could evolve: giving it more agency to recommend whether I should read the full piece or not, pulling quotes into its summaries. The critic is newest, so I don't have results yet, but the first critiques have been pointed enough that I'm optimistic.

## How the Critic works

The whole thing is built on [Val Town](https://val.town), which has become my go-to for this kind of lightweight agent infrastructure. The stack:

- **RSS feed parsing** to detect new posts
- **Blob storage** to track the last processed post and avoid duplicates
- An **agentic tool-use loop** where the LLM can search my garden via [the MCP server I built for this site](/blog/i-built-an-mcp-server-for-my-site), read specific posts, and fetch external pages via [jina.ai](https://jina.ai/)
- **HTML email** with the critique, sent via Val Town's built-in email service
- **HTTP routes** for ad-hoc testing — a `/preview?url=` endpoint that renders the critique as a web page

I built each interface by orchestrating [Claude Code](https://docs.anthropic.com/en/docs/claude-code) agents. I [designed a skill](https://github.com/joshbeckman/dotfiles/tree/master/.claude/skills/val-town-dev) for them to know how to create and manage vals on Val Town. They tested and iterated using the [Chrome DevTools MCP server](https://github.com/anthropics/anthropic-cookbook/tree/main/anthropic-mcp-client/chrome-devtools-mcp) to render the pages in real time.

All of the source code is public. The [Critic](https://www.val.town/x/joshbeckman/criticCron), [Pre-Reader](https://www.val.town/x/joshbeckman/preRead), and [Suggester](https://www.val.town/x/joshbeckman/suggestComments) vals are on Val Town. The [Val Town dev skill](https://github.com/joshbeckman/dotfiles/tree/master/.claude/skills/val-town-dev) for Claude Code is on GitHub. If you have a site with an RSS feed and a search index, you could wire up something similar in an afternoon.

## A modern website

Any one of these agents is a neat trick, but together, they're something more: a living feedback loop built into my reading and writing on this site. The pre-reader prepares me before I read. The suggester fills in gaps when I have spare attention. The critic holds me accountable after I publish.

These three replace the [Insight widget](/blog/upgraded-insight-widget-with-mcp-server) I built last year, which tried to do everything in one pass. Using it, I found two distinct needs - suggesting connections and critiquing writing - and splitting them into dedicated agents with different triggers and interaction patterns serves each need better. It's also now trivially easy to manage many vals for many distinct purposes when LLM agents are doing the coding, testing, and development for me.

I don't want to just collect and hoard links. I want to integrate, connect, and digest. I can do that in conversation with colleagues, but I can't always find a sparring partner at the moment I need one. These agents are tireless, and they know my entire body of work. They fill the gaps between conversations, keeping the garden tended when I'm not paying attention.
