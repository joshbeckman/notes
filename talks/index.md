---
layout: Page
title: Talks
cover_image_url: /assets/images/talks.jpeg
categories:
- talks
---

These are talks I've given over the years.

{% assign postsByYear = 
site.categories['talks'] | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for day in postsByYear %}
  <h2 id="{{ day.name }}">{{ day.name }}</h2>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
