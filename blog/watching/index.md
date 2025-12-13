---
layout: Page
title: Watching
emoji: "\U0001F3AC"
searchable: true
categories:
- blog
tags:
- movies
- index
serial_number: 2024.PAE.012
---
These are movies I've been watching.

{% assign postsByMonth = 
site.categories['watching'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <table class="responsive-table">
      <colgroup>
          <col/>
          <col style="width: 20ch;"/>
          <col style="width: 13ch;"/>
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
