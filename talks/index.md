---
layout: Page
title: Talks
image: "/assets/images/talks.jpeg"
tags:
- communication
- index
serial_number: 2024.PAE.006
---
These are talks I've given over the years.

{% assign postsByYear = 
site.categories['talks'] | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for day in postsByYear %}
  <h2 id="{{ day.name }}">{{ day.name }}</h2>
  {% for post in day.items %}
  {%- include PostListItem.html post=post dated=true -%}
  {% endfor %}
{% endfor %}
