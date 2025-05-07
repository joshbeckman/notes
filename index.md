---
title: From the Desk of Josh Beckman
layout: Home
permalink: /
hide_title: true
hide_footer: true
---
Hello, friends. I'm [Josh](/about/). This is where I work in public.

I make things. Not too much. Mostly for others.

{% assign month = site.time | date: "%m" | plus: 0 %}
The season is: {{ site.data.seasons[month].name }} {{ site.data.seasons[month].emoji }}
