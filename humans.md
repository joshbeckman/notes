---
layout: humans
permalink: '/humans.txt'
---
{{ site.data.proverbs | sample }}
{% assign month = site.time | date: "%m" | plus: 0 %}{{ site.data.seasons[month].emoji }}
Updated: {{ site.time | date_to_xmlschema }}
