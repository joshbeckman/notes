---
layout: Post
title: By Source
permalink: /sources/
content-type: eg
---

{% for tag in site.tags %}
  {%- if tag.first contains "articles-" or tag.first contains "books-" or tag.first contains "supplementals-" -%}
  {%- assign id = tag.first | split: '-' | last -%}
  <h3 id="{{ id }}">{{ tag.first }}</h3>
  <ul class="">
      {% for post in tag.last %}
        <li id="" style="padding-bottom: 0.6em; list-style: none;"><a href="{{ post.url }}">{{ post.title }}</a></li>
      {% endfor %}
  </ul>
  {%- endif -%}
{% endfor %}
