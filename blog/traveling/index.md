---
layout: Page
title: Traveling
emoji: "\U0001F30B"
searchable: true
categories:
- blog
tags:
- travel
- index
serial_number: 2024.PAE.015
---
This is still a work-in-progress.

Probably something like: each post has a latitude and longitude and they're all displayed on a map.

{% assign postsByMonth = 
site.categories['traveling'] | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post dated=true -%}
  {% endfor %}
{% endfor %}
