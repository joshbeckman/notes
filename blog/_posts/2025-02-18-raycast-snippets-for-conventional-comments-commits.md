---
layout: Post
date: 2025-02-18 21:18:32 +0000
title: "Raycast Snippets for Conventional Comments & Commits"
toc: true
image: 
description: 
mastodon_social_status_url: false
bluesky_status_url: false
tags:
  - tools
  - code-snippets
  - communication
  - software-engineering
---


<img width="886" alt="screenshot" src="https://github.com/user-attachments/assets/fb43fef1-2604-4247-a8da-60150267310e" />

I've been using [Raycast](https://www.raycast.com/) for the past couple years on my MacOS computers for keyboard-based hotkeys/launching/etc. It also has excellent snippet/text-expansion support.

We were discussing at work how to better structure feedback on PR/code reviews, and I shared how I use Raycast to make it easier to adhere to convention/readability/clarity: dedicated snippets. If you structure your communication with others (especially in a remote environment like we have at Shopify) consistently, then you reduce ambiguity and miscommunication and speed up everyone.

Based on [Raycast Dynamic Placeholders](https://manual.raycast.com/dynamic-placeholders) and the concepts outlined in [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and [Conventional Comments](https://conventionalcomments.org/), here are the snippets I'm using with Raycast:

```
{argument name="type" options="feat, fix, build, chore, ci, docs, perf, refactor, revert, style, test" default="feat"}{argument name="(scope)" default=""}{argument name="breaking?" options=":, !:" default=":"} {cursor}
```

[Conventional Commit easy-install to Raycast](https://ray.so/snippets/shared?snippet=%7B%22text%22%3A%22%7Bargument%20name%3D%5C%22type%5C%22%20options%3D%5C%22feat%2C%20fix%2C%20build%2C%20chore%2C%20ci%2C%20docs%2C%20perf%2C%20refactor%2C%20revert%2C%20style%2C%20test%5C%22%20default%3D%5C%22feat%5C%22%7D%7Bargument%20name%3D%5C%22(scope)%5C%22%20default%3D%5C%22%5C%22%7D%7Bargument%20name%3D%5C%22breaking%3F%5C%22%20options%3D%5C%22%3A%2C%20!%3A%5C%22%20default%3D%5C%22%3A%5C%22%7D%20%7Bcursor%7D%22%2C%22keyword%22%3A%22%3Bcci%22%2C%22name%22%3A%22conventional%20commit%22%7D)

This will produce a nicely formatted commit title, e.g. `feat(editor): Add hover state to graph nodes`.

```
**{argument name="label" options="praise, nitpick, suggestion, issue, todo, question, thought, chore, note" default="question"}:({argument name="decoration" options="non-blocking, blocking, if-minor" default="non-blocking"}):** {cursor}
```

[Conventional Comment easy-install to Raycast](https://ray.so/snippets/shared?snippet=%7B%22name%22%3A%22conventional%20comment%22%2C%22text%22%3A%22**%7Bargument%20name%3D%5C%22label%5C%22%20options%3D%5C%22praise%2C%20nitpick%2C%20suggestion%2C%20issue%2C%20todo%2C%20question%2C%20thought%2C%20chore%2C%20note%5C%22%20default%3D%5C%22question%5C%22%7D%3A(%7Bargument%20name%3D%5C%22decoration%5C%22%20options%3D%5C%22non-blocking%2C%20blocking%2C%20if-minor%5C%22%20default%3D%5C%22non-blocking%5C%22%7D)%3A**%20%7Bcursor%7D%22%2C%22keyword%22%3A%22%3Bcco%22%7D)

This will produce a nicely formatted comment subject line, e.g. `**question (non-blocking):** How did you get this this threshold/default value?`.
