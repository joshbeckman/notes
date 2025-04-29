---
layout: Page
title: Exercise
emoji: 🏋
searchable: true
tags:
- exercise
- index
---

My exercise journal, pulled from [Strava](https://www.strava.com/athletes/75003252).

{% assign postsByMonth = 
site.categories['exercise'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <table>
    <colgroup>
      <col />
      <col style="width: 20ch" />
      <col style="width: 12ch" />
    </colgroup>
      <thead>
        <tr>
            <td colspan="3">
                <span id="{{ day.name }}">{{ day.name }}</span>
            </td>
        </tr>
      </thead>
  {% for post in day.items %}
    <tr>
        <td>
          <a href="{{post.url}}">
            {{ post.title }}
          </a>
        </td>
        <td>
            {{ post.date | date: '%d %B %Y' }}
        </td>
        <td>
            {% if post.exercise_data['distance_in_miles'] %}
                {{post.exercise_data['distance_in_miles']}}
            {% else %}
                {{post.exercise_data['max_heartrate']}}
            {% endif %}
        </td>
    </tr>
  {% endfor %}
  </table>
{% endfor %}
