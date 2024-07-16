---
layout: Post
date: 2024-07-15 00:00:00 +0000
title: "Switching Search from Lunr.js to Fuse.js"
toc: true
image: 
description: 
mastodon_social_status_url: https://mastodon.social/@joshbeckman/112794595485989662
tags: 
  - personal-blog
  - search
---



I've been annoyed with the search results - on [this site search](/search/) - from [lunr.js](https://lunrjs.com) recently.

For example: I search "eden" or "garden of eden" and the results don't contain [this note describing a "Garden-of-Eden configuration"](https://www.joshbeckman.org/notes/264827193). I'm using the exact same sequence of characters and it won't find the result I want. Lunr just plain [doesn't support exact-phrase matching](https://github.com/olivernn/lunr.js/issues/62). 

So I think about some of my other recent searches and I'm realizing that there's another behavior of lunr that I don't like: adding terms to your query often *increases* the result set instead of *constraining* it. This is basically because lunr turns every term into its own wildcard.

I realized - though I had been using lunr.js for various projects since the 2010s - I had always used the library in searching catalogs and other such things that filtered based on multiple attributes of the elements. I hardly ever relied on the text-search alone to get the right result.

So I started exploring other options. At [work](https://www.shopify.com), we're using [Fuse.js](https://www.fusejs.io) for some features, so I figured I would try it out.

After an afternoon of remapping the data model from one to the other, I have the search page running with fuse.js and it seems to get me the results I want in the right order. It often returns _too many_ results, but at least I have coded my own filter to clamp the relevance down to the top 20 items based on the likelihood of the leading results to be correct.

Notably, I'm holding off (for now) on switching the [insight](/insight) RAG search implementation. I kind of like the behavior of lunr.js returning random other results in that context. But I'm still figuring out exactly _what_ behavior I want there, so it may be migrated in the future.
