---
layout: Page
title: Proverbs
searchable: true
toc: true
permalink: /proverbs/
emoji: 💭
tags:
- index
- beliefs
---

These are little sayings that I've picked up from others and some that I've found on my own.
They guide me in the right direction.

{% for proverb in site.data.proverbs %}
### {{ proverb }}
{% endfor %}