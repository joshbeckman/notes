---
layout: Post
date: '2025-07-01 16:31:19 +0000'
title: Buildkite Browser Notifications Userscript
toc: true
image: "/assets/images/3675f995-d38f-4b29-9e3f-97af6a80f6ae.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114779202830676305
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lswammnyxq2v
tags:
- code-snippets
---


<img width="398" alt="buildkite notification example" src="/assets/images/3675f995-d38f-4b29-9e3f-97af6a80f6ae.png" />

At Shopify, we use [Buildkite](http://buildkite.com/) for running continuous integration tests. That means I'm opening up and monitoring Buildkite builds dozens of times a day, checking on them, browsing them, etc. Sadly, Buildkite's interface doesn't provide browser notifications for build status (e.g. when it fails or succeeds).

So, I built my own implementation: [Get a browser notification on buildkite build status change](https://gist.github.com/joshbeckman/d4eb63983519a198595ca63df4a287df). Now I can let my browser tell me when to check back on those tabs.

<script src="https://gist.github.com/joshbeckman/d4eb63983519a198595ca63df4a287df.js"></script>

You can use this (like I do) with [Violentmonkey](https://violentmonkey.github.io/) or some other userscript extension in your browser or you can wrap this up as [a bookmarklet](https://www.joshbeckman.org/blog/my-bookmarks-are-all-bookmarklets) just as easily.
