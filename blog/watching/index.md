---
layout: Page
title: Watching
emoji: 🎬
searchable: true
categories:
- blog
tags:
- movies
- index
---

These are movies I've been watching.

{% assign postsByMonth = 
site.categories['watching'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <table class="responsive-table">
      <colgroup>
          <col/>
          <col style="width: 20ch;"/>
          <col style="width: 12ch;"/>
      </colgroup>
      <thead>
        <tr>
            <td colspan="3">
                <span id="{{ day.name }}">{{ day.name }}</span>
            </td>
        </tr>
      </thead>
  {% for post in day.items %}
  {%- include PostTableRow.html post=post -%}
  {% endfor %}
  </table>
{% endfor %}
