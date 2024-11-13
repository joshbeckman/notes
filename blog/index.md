---
layout: Page
title: Blog
emoji: 📓
searchable: true
tags:
- index
- publishing
---

<div id="toc-and-metadata"><ul id="toc" class="section-nav">
<li class="toc-entry toc-h2"><a href="attending">Concerts</a></li>
<li class="toc-entry toc-h2"><a href="reading">Books</a></li>
<li class="toc-entry toc-h2"><a href="watching">Movies</a></li>
<li class="toc-entry toc-h2"><a href="traveling">Travel</a></li>
<li class="toc-entry toc-h2"><a href="working">Desks</a></li>
<li class="toc-entry toc-h2"><a href="listening">Music</a></li>
</ul></div>

{% assign postsByMonth = 
site.categories['blog'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post -%}
  {% endfor %}
{% endfor %}
