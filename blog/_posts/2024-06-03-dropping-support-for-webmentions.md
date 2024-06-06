---
layout: Post
date: 2024-06-03 00:00:00 +0000
title: "Dropping Support for Webmentions"
toc: true
image: 
description: 
tags: 
  - personal-blog
  - publishing
  - blogs
---

Last week I dropped support for [webmentions](https://indieweb.org/Webmention) on this site. I had implemented support for them around a year ago through a pairing of [webmention.io](https://indieweb.org/webmention.io) to receive them and [my own custom GitHub Actions script](https://github.com/joshbeckman/notes/commit/3d03ad8957e8d739ef81f22f133956344bb3e93e) to parse my posts and send them to supporting servers.

I dropped them because I hadn't received a single webmention in the year of supporting them and I started seeing more and more errors when attempting to send them to recipients. I also read a few well-reasoned posts on others' sites about how webmentions are often unintentionally sent by publishing platforms and thus have the effect of unintentionally displaying personal information on other sites. I think that, for now at least, I'm just going to step back from them.

In lieu of webmentions, because I still want to [get social online](https://www.joshbeckman.org/blog/getting-social-online), I'm going to be scripting up a better connection from posts here into the Mastodon/ActivityPub/Fediverse.
