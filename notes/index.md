---
layout: Page
title: Notes
emoji: "\U0001F4DD"
tags:
- index
serial_number: 2024.PAE.001
---
I collect notes from things I read and hear.
There are currently {{ site.categories['notes'].size }} notes collected here.
The best way to browse them is through [the index](/tags).

Or you can start by browsing [my favorites](/search?q=%27favorite&keys=tags) or [the daily review](/notes/daily-review/).

Here are the most recent additions:

{% for post in site.categories['notes'] limit: 50 %}
{%- include PostListItem.html post=post dated=true -%}
{% endfor %}
