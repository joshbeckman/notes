---
layout: humans
permalink: '/humans.txt'
title: Humans.txt
searchable: true
---
{{ site.data.proverbs | sample }}
{% assign month = site.time | date: "%m" | plus: 0 %}{{ site.data.seasons[month].emoji }}
Updated: {{ site.time | date_to_xmlschema }}
Version: {{ site.version }}
