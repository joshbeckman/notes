---
layout: humans
permalink: "/humans.txt"
title: Humans.txt
searchable: true
serial_number: 2023.PAE.005
---
{% assign beliefs_page = site.pages | where: "permalink", "/beliefs/" | first %}Belief:  {{ beliefs_page.raw_content | random_list_item | remove_first: "- " | strip_html | strip }}
Season:  {% include CurrentSeason.html %}{{ current_season.name }} {{ current_season.marker }}
Updated: {{ site.time | date_to_xmlschema }}
Version: {{ site.version_name }} ({{ site.version }})
