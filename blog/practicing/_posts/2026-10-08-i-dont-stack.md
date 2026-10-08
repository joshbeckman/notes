---
layout: Post
date: '2026-10-08 16:16:41 +0000'
title: I Don't Stack
toc: true
image:
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/117407192678989659
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3mxfcm6ufpt22
tags:
- software-engineering
serial_number: 2026.BLG.086
---
I don't develop [pull requests in stacks](https://docs.github.com/en/pull-requests/how-tos/stacked-pull-requests). Never have.

I shun stacks because I think they
- sequentialize parallelizable work
- incentivize building in horizontal slices rather than vertical slices
- make people feel more invested in a PR (because it has dependents/dependencies) than they otherwise would be

Anyway, no one should really care about this anymore (now that we have agents that can manage this complexity for us). But this argument comes up from time to time[^1] so I figured I should write out my reasons. 

[^1]: Honestly I can't seem to figure out what causes it to re-appear. I guess when new platforms build the functionality, people re-discover the idea?
