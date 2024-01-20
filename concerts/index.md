---
layout: Page
title: Attending
categories:
- Concerts
---

These are concerts I've been attending.

{% assign postsByMonth = 
site.categories['concerts'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h2 id="{{ day.name }}">{{ day.name }}</h2>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
