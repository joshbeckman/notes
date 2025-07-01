---
layout: Page
title: Daily Review
categories:
- notes
permalink: /notes/daily-review/
searchable: true
tags:
- index
---

This is a mirror of my [daily review provided by Readwise]({{site.data.readwise_daily_review[':url']}}) (a spaced repetition system for my notes).

{% for highlight in site.data.readwise_daily_review[':highlights'] %}
{% for post in site.categories['notes'] %}
{% assign post_higlight_id = post['highlight_id'] | prepend: '' %}
{% if post_higlight_id == highlight['highlight_id'] %}
{%- include PostListItem.html post=post dated=true -%}
{% endif %}
{% endfor %}
{% endfor %}
