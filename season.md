---
layout: Page
title: The Season
permalink: "/season"
searchable: true
tags:
- time
serial_number: 2026.PAE.006
---
{% include CurrentSeason.html %}

Things come and go in seasons. These days, the year unfolds in 24 small seasons, each lasting about 15 days. Right now we're in **{{ current_season.name }}** {{ current_season.marker }}.

{% include SeasonsTimeline.html %}

<ul class="seasons-list">
{% for season in site.data.seasons %}
<li class="season-row{% if season.name == current_season.name %} current{% endif %}" style="--season-hue: {% case forloop.index0 %}{% when 0 %}220{% when 1 %}210{% when 2 %}170{% when 3 %}155{% when 4 %}140{% when 5 %}125{% when 6 %}110{% when 7 %}95{% when 8 %}60{% when 9 %}50{% when 10 %}40{% when 11 %}30{% when 12 %}22{% when 13 %}14{% when 14 %}6{% when 15 %}358{% when 16 %}348{% when 17 %}335{% when 18 %}315{% when 19 %}295{% when 20 %}275{% when 21 %}258{% when 22 %}242{% when 23 %}230{% endcase %}">
<span class="season-row-swatch" aria-hidden="true"></span>
<strong class="season-row-name">{{ season.marker }} {{ season.name }}</strong>
<span class="season-row-date">{{ season.start_month }}/{{ season.start_day }}</span>
<em class="season-row-desc">{{ season.description }}</em>
</li>
{% endfor %}
</ul>

---

These seasons mark natural phenomena rather than fixed calendar dates. Adapted from [Small Seasons](https://smallseasons.guide/).
