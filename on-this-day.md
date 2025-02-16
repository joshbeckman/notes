---
layout: Page
title: On This Day
searchable: true
tags:
- index
- personal-blog
---

These are the posts I've written on this day in previous years:

{% assign today = site.time | date: "%m-%d" %}
{% for post in site.posts %}
{% assign post_date = post.date | date: "%m-%d" %}
{% if post_date == today %}
{%- include PostListItem.html post=post dated=true -%}
{% endif %}
{% endfor %}

