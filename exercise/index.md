---
layout: Page
title: Exercise
emoji: "\U0001F3CB"
searchable: true
tags:
- exercise
- index
serial_number: 2025.PAE.003
---
My exercise journal, pulled from [Strava](https://www.strava.com/athletes/75003252).

{% assign postsByMonth = 
site.categories['exercise'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
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
    <tr>
        <td>
          <a href="{{post.url}}">
            {{ post.title }}
          </a>
        </td>
        <td data-label="Date:">
            {{ post.date | date: '%d %B %Y' }}
        </td>
        <td data-label="{% if post.exercise_data['distance_in_miles'] %}Distance: {% else %}Heart Rate: {% endif %}">
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
