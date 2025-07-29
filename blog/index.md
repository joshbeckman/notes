---
layout: Page
title: Blog
searchable: true
tags:
- index
- publishing
- personal-blog
serial_number: 2024.PAE.001
---
<div id="toc-and-metadata"><ul id="toc" class="section-nav">
<li class="toc-entry toc-h2"><a href="/blog/attending">Attending</a></li>
<li class="toc-entry toc-h2"><a href="/blog/listening">Listening</a></li>
<li class="toc-entry toc-h2"><a href="/blog/practicing">Practicing</a></li>
<li class="toc-entry toc-h2"><a href="/blog/reading">Reading</a></li>
<li class="toc-entry toc-h2"><a href="/blog/traveling">Traveling</a></li>
<li class="toc-entry toc-h2"><a href="/blog/watching">Watching</a></li>
<li class="toc-entry toc-h2"><a href="/blog/working">Working</a></li>
</ul></div>

I have some collections for specific topics (above) or you can browse the full list (below).

{% assign postsByMonth = 
site.categories['blog'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  {% for post in day.items %}
  {%- include PostListItem.html post=post dated=true -%}
  {% endfor %}
{% endfor %}
