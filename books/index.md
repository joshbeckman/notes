---
layout: Page
title: Books Read
categories:
- books
---

These are books I've been reading.

{% assign postsByMonth = 
site.categories['books'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
