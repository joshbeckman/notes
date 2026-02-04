---
layout: humans
permalink: "/humans.txt"
title: Humans.txt
searchable: true
serial_number: 2023.PAE.005
---
{% assign proverb = site.categories['proverbs'] | sample %}
{{ proverb.title }}
Season:  {% include CurrentSeason.html %}{{ current_season.name }} {{ current_season.emoji }}
Updated: {{ site.time | date_to_xmlschema }}
Version: {{ site.version }}
