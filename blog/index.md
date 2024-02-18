---
layout: Page
title: Blog
emoji: 📓
searchable: true
tags:
- index
- publishing
---

View a subcategory if you like:
- 🎟️ [Concerts I've been attending](attending)
- 📚 [Books I've been reading](reading)
- 🎬 [Movies I've been watching](watching)
- 🌋 [Travel I've been going on](traveling)
- 🪑 [Desks I've been working at](working)
- 🎶 [Music I've been listening to](listening)

Here are all the posts:

{% assign postsByMonth = 
site.categories['blog'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
