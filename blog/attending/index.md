---
layout: Page
title: Attending
emoji: 🎟
searchable: true
categories:
- blog
tags:
- music
- index
---

Concerts are the best way to listen to music. You should go to them and support the artists you like.

These are concerts I've been attending.

{% assign postsByMonth = 
site.categories['attending'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h2 id="{{ day.name }}">{{ day.name }}</h2>
  {% for post in day.items %}
  {%- include PostListItem.html post=post dated=true -%}
  {% endfor %}
{% endfor %}
