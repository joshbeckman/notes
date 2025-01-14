---
layout: Page
title: Josh's Notes
emoji: 📝
tags:
- index
---

I collect notes from things I read and hear.
There are currently {{ site.categories['notes'].size }} notes collected here.
The best way to browse them is through [the index](/tags).

Or you can start by browsing [my favorites](/tags#favorite).

Here are the most recent additions:

{% for post in site.categories['notes'] limit: 10 %}
{%- include PostListItem.html post=post -%}
{% endfor %}
