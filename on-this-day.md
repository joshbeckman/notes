---
layout: Page
title: On This Day
searchable: true
permalink: /on-this-day
tags:
- index
- personal-blog
serial_number: 2025.PAE.001
---
{% include CurrentSeason.html %}
[The season](/season) is: <strong>{{ current_season.name }}</strong> {{ current_season.emoji }}<br/><em>{{ current_season.description }}</em>

These are the posts I've written on this day in previous years:

{% assign today = site.time | date: "%m-%d" %}
{% for post in site.posts %}
{% assign post_date = post.date | date: "%m-%d" %}
{% if post_date == today %}
{%- include PostListItem.html post=post dated=true -%}
{% endif %}
{% endfor %}

## Browse nearby days

{% assign today_seconds = site.time | date: "%s" | plus: 0 %}
{% assign day_seconds = 86400 %}
<p style="text-align: center;">
{% for i in (1..5) reversed %}{% assign offset = i | times: day_seconds %}{% assign target_seconds = today_seconds | minus: offset %}{% assign target_date = target_seconds | date: "-%m-%d" %}{% assign display_date = target_seconds | date: "%b %-d" %}<a href="/search?q='{{ target_date }}&keys=date">{{ display_date }}</a> · {% endfor %}<strong>Today</strong>{% for i in (1..5) %} · {% assign offset = i | times: day_seconds %}{% assign target_seconds = today_seconds | plus: offset %}{% assign target_date = target_seconds | date: "-%m-%d" %}{% assign display_date = target_seconds | date: "%b %-d" %}<a href="/search?q='{{ target_date }}&keys=date">{{ display_date }}</a>{% endfor %}
</p>

Alternatively, you can look through [the daily review](/notes/daily-review) or browse the [heatmap calendar](/heatcal).
