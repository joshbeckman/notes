---
layout: Page
title: Notes
categories:
- notes
---

I collect notes from things I read and hear.
The best way to browse them is through [the index](/tags).

Here are the most recent additions:

{% for post in site.categories['notes'] limit: 3 %}
{%- include PostListItem.html post=post -%}
{% endfor %}
