---
layout: humans
permalink: "/humans.txt"
title: Humans.txt
searchable: true
serial_number: 2023.PAE.005
---
{{ site.data.proverbs | sample }}
Season:  {% assign month = site.time | date: "%m" | plus: 0 %}{{ site.data.seasons[month].emoji }}
Updated: {{ site.time | date_to_xmlschema }}
Version: {{ site.version }}
