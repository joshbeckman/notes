---
layout: Page
title: Practicing
searchable: true
categories:
- blog
tags:
- index
---

Lessons learned and observations from working in the software engineering industry.

{% assign postsByMonth = 
site.categories['practicing'] | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post dated=true -%}
  {% endfor %}
{% endfor %}
