---
layout: Page
title: Blog
categories:
- blog
---

This is a general blog.

{% assign postsByMonth = 
site.categories['blog'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
