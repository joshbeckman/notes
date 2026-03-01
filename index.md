---
title: Josh Beckman's Organization
layout: Home
permalink: "/"
searchable: true
hide_title: true
serial_number: 2023.PAE.003
---
Hello, friends. I'm Josh Beckman. I make things — mostly software, mostly for others. This is where I keep years of writing, notes, and reading highlights — a [knowledge garden](/about-this-site) built in the open. [I write](/blog) about software craft, building, and whatever I'm learning. Read [more about me](/about), [what I believe](/beliefs), or [jump to navigation](#footer).

## Popular

{% assign popular_posts = site.tags['popular'] | sort: 'date' | reverse %}
{% for post in popular_posts limit:3 %}
  {%- include PostListItem.html post=post dated=true -%}
{% endfor %}

[See all popular posts →](/search/?q=%27popular&keys=tags)

## Recent

{% for post in site.posts limit:6 %}
  {%- include PostListItem.html post=post dated=true -%}
{% endfor %}

{% include CurrentSeason.html %}
[The season](/season) is: <strong>{{ current_season.name }}</strong> {{ current_season.marker }}<br/><em>{{ current_season.description }}</em>
