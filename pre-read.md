---
layout: Page
title: Pre-Read
permalink: "/pre-read/"
emoji: "\U0001F4D6"
searchable: true
tags:
- index
- personal-blog
- llm
- ai
serial_number: 2026.PAE.010
---
This page pre-reads a web page through the lens of my knowledge garden, surfacing what I've already written about in relation to the piece. Three perspectives — proponent, opponent, and questioner — frame the page against prior notes and posts.

<div id="preread-menu">
<form id="preread-form" method="GET">
  <div style="margin-bottom:1em">
    <label for="preread-url">Page URL</label>
    <input id="preread-url" type="text" name="url" placeholder="https://example.com/article" style="width:100%;margin-top:0.25em">
  </div>
  <div style="margin-bottom:1em">
    <label for="preread-password">Password</label>
    <input id="preread-password" type="password" name="password" style="width:100%;margin-top:0.25em">
  </div>
  <button type="submit">Pre-Read</button>
</form>
</div>
<h2 id="page-title"></h2>
<div id="perspectives"></div>
<div id="preread-loading" style="display:none" class="lds-ellipsis"><div></div><div></div><div></div><div></div><em>Pre-reading through the garden</em></div>
<script src="/assets/js/pre-read.js"></script>
