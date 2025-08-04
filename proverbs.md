---
layout: Page
title: Proverbs
searchable: true
permalink: "/proverbs/"
emoji: "\U0001F4AD"
tags:
- index
- beliefs
serial_number: 2024.PAE.024
---
These are little sayings that I've picked up from others and some that I've found on my own.
They guide me in the right direction.

{% for proverb in site.categories['proverbs'] %}

{{ proverb.title }} <a href="{{proverb.url}}">&rarr;</a>
{% endfor %}
