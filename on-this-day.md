---
layout: Page
title: On This Day
searchable: true
permalink: /on-this-day
tags:
- index
- personal-blog
serial_number: 2025.PAE.001
---
These are the posts I've written on this day in previous years:

{% assign today = site.time | date: "%m-%d" %}
{% for post in site.posts %}
{% assign post_date = post.date | date: "%m-%d" %}
{% if post_date == today %}
{%- include PostListItem.html post=post dated=true -%}
{% endif %}
{% endfor %}

Alternatively, you can look through [the daily review](/notes/daily-review) or browse the [heatmap calendar](/heatcal).
