---
layout: Post
date: '2025-06-10 02:32:09 +0000'
title: Tracing Sequences and Finding Anchors
toc: true
image: "/assets/images/0446fa9e-88c8-4bec-982f-0940c4007afa.jpeg"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114657458052945348
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lra6ji5j5u2k
tags:
- personal-blog
- taxonomy
- research
---


![balloons on a chain link fence](/assets/images/0446fa9e-88c8-4bec-982f-0940c4007afa.jpeg)

I've added two new research tools to my site. They act as a mirror to help me find emergent thinking and encourage exploration of the relationships between my years of reading and writing. They [make the links legible](https://www.joshbeckman.org/blog/learn-to-link-better) and help me strengthen the centers (instead of [weeding the edges](https://www.joshbeckman.org/blog/weeding-the-edges)).

## Sequences

Last week I had an idea while gardening the yard:

> What if I could trace a path, backlink to backlink, through posts on my site? What little trains of thought would it show me? Could it show me [veins of circulation](http://localhost:4000/notes/760316846)?

I built [a Jekyll plugin for my site last year to calculate each post's backlinks](https://github.com/joshbeckman/notes/blob/5a41ec15a998c8dedac3e991bf5b15e2315108fc/_plugins/raw_content.rb) (other places on the site that link to _it_). I've always found it useful to see what else references something - lends it weight.

I realized that I could, [in that same plugin](https://github.com/joshbeckman/notes/blob/5097938f139c5c8d88a582f5c0abe3ada1aaacbe/_plugins/raw_content.rb#L62), walk those backlinks back and build a set of sequences for the site. So now, that's a new tool: [Sequences](/sequences). For now, the minimum sequence length is 3 posts (two is just a link). I use the sequences to explore a thought in depth, following a curated path through related posts, notes, and comments. I like to think of each new sequence as a happy little discovery of reasoning.

## Anchors

A couple days later, after browsing these sequences, I started to see the same few posts pop up in several of them.

> I wonder which posts are the most backlinked? Which ones are carrying the most weight for the rest of the site? What are the [emerging centers](https://www.joshbeckman.org/notes/475090054)?

So I [added that to the Jekyll plugin](https://github.com/joshbeckman/notes/commit/b1d89c8819dd391e142de2edbd50e9dc1462b546#diff-11600b9c18477e9076c4a4be95e66e5a99b88d22426613c5dd4cba3d24f69a5e) and site build too: summing up the count of backlinks to each post and selecting the top most-linked ones. For now, I'm just considering the top 5% of posts with the most backlinks: I don't need to game this system. These posts act as central hubs that my thinking and notes naturally gravitate toward and references. Or, maybe, hopefully, new anchors are founded.

## The Plugin

This Jekyll plugin has become more and more important to the utility of this site: building backlinks, sequences, anchors. Should I open-source it? Would you use it? Let me know.
