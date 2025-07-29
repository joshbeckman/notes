---
layout: Page
title: Site Index by Topic
permalink: "/tags/"
tags: index
serial_number: 2024.PAE.014
---
{% for tag in site.tags %}
<h2 id="{{ tag | first }}">{{ tag | first }}</h2>
<ul class="">
<li>
  <a href="/insight?topic={{ tag | first | split: '-' | join: ' ' | url_encode }}">💡 Insight</a>
</li>
<li>
  <a href="/search?q=%27{{ tag | first }}&keys=tags">
  {{ tag | last | size }} Posts
  </a>
</li>
</ul>
{% endfor %}
