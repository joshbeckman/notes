---
layout: Post
title: Tags Index
permalink: /tags/
content-type: eg
---


{%- assign tags = site.tags | sort %}
{% for tag in tags %}
  {%- assign conc = tag | first -%}
  <h3 id="{{ conc }}">{{ conc }}</h3>
  <ul class="">
  {% for post in tag.last %} 
    <li style="padding-bottom: 0.6em; list-style: none;"><a href="{{post.url}}">{{ post.title }}</a></li>
  {% endfor %}
  </ul>
{% endfor %}
