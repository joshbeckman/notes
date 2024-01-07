---
layout: Page
title: Movies Watched
---

These are movies I've been watching.

{% assign postsByMonth = 
site.categories['movies'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
