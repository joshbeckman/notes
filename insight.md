---
layout: Page
title: Insight
permalink: "/insight/"
emoji: "\U0001F4A1"
searchable: true
tags:
- index
- personal-blog
- llm
- ai
serial_number: 2024.PAE.022
---
This page generates "insights" from my posts - you can [read about how it works](https://www.joshbeckman.org/blog/using-an-llmand-rag-to-wring-insights-from-my-posts).

Each time you come to this page, it will attempt to generate a new insight. Note that, to prevent abuse, this is currently limited to 10 insights/min (this is across all users: _please share/play nicely_).

<div id="insight-menu">
<details name="insight-options" open>
<summary>Random Topic</summary>
<p>
<form id="insight-form-random" method="GET">
  <input type="hidden" name="topic" value="random">
  <button type="submit">Generate Insight</button>
</form>
</p>
</details>
<details name="insight-options">
<summary>Specific Topic</summary>
<p>
<form id="insight-form-topic" method="GET">
  <input type="text" name="topic" placeholder="Specify a topic...">
  <button type="submit">Generate Insight</button>
</form>
</p>
</details>
<details name="insight-options">
<summary>Ask a Question</summary>
<p>
<form id="insight-form-question" method="GET">
  <input type="text" name="question" placeholder="Your question...">
  <button type="submit">Ask</button>
</form>
</p>
</details>
<details name="insight-options">
<summary>Specific Post</summary>
<p>
<form id="insight-form-post" method="GET">
  <input type="text" name="post" placeholder="https://www.joshbeckman.org/...">
  <button type="submit">Consider</button>
</form>
</p>
</details>
</div>
<h2 id="topic"></h2>
<div id="insight"></div>
<div id="insight-loading" style="display:none" class="lds-ellipsis"><div></div><div></div><div></div><div></div><em>Generating</em></div>
<script src="/assets/js/insight.js"></script>
