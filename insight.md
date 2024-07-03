---
layout: Page
title: Insight
permalink: /insight/
tags:
- index
- personal-blog
---
This page generates a random "insight" from all my posts, based on [this approach](https://www.joshbeckman.org/notes/741185037) to [retrieval-augmented generation](https://www.joshbeckman.org/search/?q=rag).

Essentially, it selects a few posts at random, asks an [LLM](https://www.joshbeckman.org/tags/#llm) to identify a common topic between them, then searches my posts for things related to that topic, then asks another LLM to "identify a unique insight" about the topic, using those posts as context.

Each time you come to this page, it will attempt to generate a new insight.

<h2 id="topic"></h2>
<div id="insight">Loading insight...</div>
<script src="/assets/js/insight.js"></script>
