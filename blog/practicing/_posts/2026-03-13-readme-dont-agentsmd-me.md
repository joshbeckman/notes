---
layout: Post
date: '2026-03-13 13:04:19 +0000'
title: README, Don't AGENTS.md Me
toc: true
image:
description:
mastodon_social_status_url: false
bluesky_status_url: false
tags:
- ai
- tools
- software-engineering
serial_number: 2026.BLG.039
---
This is the place where I rant that [the`AGENTS.md` pattern](https://agents.md/) is a distraction and slows down your software development.

The software engineering industry has had a standard of adding a `README.md` file to the root of projects and also the root of any subdirectory of those projects where deemed necessary. These files are easily discoverable by operators of the codebase, and their contents - while not standard - have been embraced as a place to put instructions for patterns and how to operate in the codebase.

with the rise of coding agents over the last couple years, people found that they needed to give them special instructions because they were error prone in certain ways, and we hadn't built out the harnesses and capabilities for them to replicate how human operators work in a code base. That is no longer true today.

We We have incredibly capable models and the harnesses and tooling that we give them (like shell access and MCPs for browser control, among hundreds of other tools), being that they can do *everything* that a human operator can do to operate on the code. Everything I would say to a human operator in the codebase, I would say to an LLM agent working in that same codebase. 

So, I just revamped my project's READMEs and symlinked them to the `AGENTS.md` location. It's not useful to separate the instructions for humans from LLM agents. In fact, when we separate them, we _increase_ the likelihood that they will operate in different ways and do things that the other does not expect or intend. This actively slows down development on both sides.

Solidifying a single place - the old `README.md` standard, that is present in all modern software - is the path forward. I'm symlinking my READMEs to conform to this standard for now, because it's free and doesn't clutter anything for me, but I hope it eventually falls away.
