---
layout: Page
title: The Season
permalink: /season
searchable: true
tags:
- time
---

{% include CurrentSeason.html %}

Things come and go in seasons. These days, the year unfolds in 24 small seasons, each lasting about 15 days. Right now we're in **{{ current_season.name }}** {{ current_season.emoji }}.

<div class="seasons-grid">
{% for season in site.data.seasons %}
<div class="season{% if season.name == current_season.name %} current{% endif %}">
<span class="emoji">{{ season.emoji }}</span>
<strong>{{ season.name }}</strong>
<span class="date">{{ season.start_month }}/{{ season.start_day }}</span>
<em>{{ season.description }}</em>
</div>
{% endfor %}
</div>

<style>
.seasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
.season {
  padding: 1rem;
  border: 1px solid var(--border-color, #ddd);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.season.current {
  border-color: var(--accent-color, #0066cc);
  border-width: 2px;
  background: var(--highlight-bg, rgba(0, 102, 204, 0.05));
}
.season .emoji {
  font-size: 1.5rem;
}
.season .date {
  font-size: 0.85rem;
  opacity: 0.7;
}
.season em {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>

---

These seasons mark natural phenomena rather than fixed calendar dates. Adapted from [Small Seasons](https://smallseasons.guide/).
