---
layout: Page
title: Working
emoji: 🪑
searchable: true
categories:
- blog
tags:
- workspaces
- index
---

These are the desks I have worked at over the years.

I spend something like 8 hours every day at a desk, so it's a big part of my life that I'm constantly trying to improve.

{% assign postsByYear = 
site.categories['working'] | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for day in postsByYear %}
  <h2 id="{{ day.name }}">{{ day.name }}</h2>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
