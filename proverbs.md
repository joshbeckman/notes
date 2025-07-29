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

{% assign shuffled_proverbs = site.data.proverbs | sample: site.data.proverbs.size %}
{% for proverb in shuffled_proverbs %}
<p id="{{proverb | slugify}}" class="departure"><a href="#{{proverb | slugify}}">#</a> {{ proverb | upcase }}</p>
{% endfor %}
