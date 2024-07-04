---
layout: Page
title: Insight
permalink: /insight/
emoji: 💡
searchable: true
tags:
- index
- personal-blog
- llm
- ai
---
This page generates a random "insight" from all my posts, based on [this approach](https://www.joshbeckman.org/notes/741185037) to [retrieval-augmented generation](https://www.joshbeckman.org/search/?q=rag).

Essentially, it selects a few posts at random, asks an [LLM](https://www.joshbeckman.org/tags/#llm) to identify a common topic between them, then searches my posts for things related to that topic, then asks another LLM to "identify a unique insight" about the topic, using those posts as context. The full code is available [here](https://www.val.town/v/joshbeckman/amethystHalibut) and is hosted on [Val Town](https://www.val.town/).

Each time you come to this page, it will attempt to generate a new insight.

<h2 id="topic"></h2>
<div id="insight"><em>Generating insight...</em></div>
<script src="/assets/js/insight.js"></script>
