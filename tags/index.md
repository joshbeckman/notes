---
layout: Page
title: Site Index by Topic
permalink: /tags/
tags: index
---

{% for tag in site.tags %}
<h2 id="{{ tag | first }}">{{ tag | first }}</h2>
<ul class="">
<li>
  <a href="/insight?topic={{ tag | first | split: '-' | join: ' ' | url_encode }}">💡 Insight</a>
</li>
<li>
  <a href="/search?q=%27{{ tag | first }}&keys=tags">All Posts</a>
</li>
</ul>
{% endfor %}
<h2 id="untagged">Untagged</h2>
{% for post in site.posts %}
{% if post.tags.size == 0 %}
  <li style=""><a href="{{post.url}}">
    {{ post.title | strip_html | strip | escape | truncate: 70}}
  </a></li>
{% endif %}
{% endfor %}
