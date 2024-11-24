---
layout: Page
title: Site Index By Source
permalink: /sources/
tags: index
---

{% assign postsBySource = 
site.posts | group_by_exp:"post", "post.book" %}
{% for source in postsBySource %}
{% if source.name %}
  <h3 id="{{ source.name }}">{{ source.items.first.book_title }}</h3>
  <ul class="">
      {% for post in source.items %}
        <li style="">
          <a href="{{post.url}}">
            {{ post.content | strip_html | strip | escape | truncate: 70}}
          </a>
        </li>
      {% endfor %}
  </ul>
{% endif %}
{% endfor %}
