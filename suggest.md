---
layout: Page
title: Suggest Comments
permalink: "/suggest/"
emoji: "\U0001F4AC"
searchable: true
tags:
- index
- personal-blog
- llm
- ai
serial_number: 2026.PAE.008
---
This page generates suggested comments for posts in the knowledge garden from three perspectives. You can [read about how it works](https://www.joshbeckman.org/blog/using-an-llmand-rag-to-wring-insights-from-my-posts).

See also: [Uncommented Notes](/uncommented/) for notes that need commentary.

<div id="suggest-menu">
<details name="suggest-options" open>
<summary>Specific Post</summary>
<p>
<form id="suggest-form" method="GET">
  <input type="text" name="post" placeholder="https://www.joshbeckman.org/..." style="width:100%">
  <button type="submit">Suggest Comments</button>
</form>
</p>
</details>
</div>
<h2 id="post-title"></h2>
<div id="suggestions"></div>
<div id="suggest-loading" style="display:none" class="lds-ellipsis"><div></div><div></div><div></div><div></div><em>Generating suggestions</em></div>
<script src="/assets/js/suggest.js"></script>
