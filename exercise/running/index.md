---
layout: Page
title: Running
searchable: true
categories:
- exercise
tags:
- index
---
Running activities from my [exercise journal](/exercise), pulled from [Strava](https://www.strava.com/athletes/75003252).

{% include ContributionGraph.html category="running" %}

{% assign postsByMonth = 
site.categories['running'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  {% assign active_days = day.items | count_active_days %}
  {% assign total_seconds = day.items | sum_exercise_time %}
  {% assign total_miles = day.items | sum_miles %}
  <table class="responsive-table">
      <colgroup>
          <col/>
          <col style="width: 20ch;"/>
          <col style="width: 12ch;"/>
      </colgroup>
      <thead>
        <tr>
            <td colspan="1">
                <span id="{{ day.name }}">{{ day.name }}</span>
            </td>
            <td colspan="2">
                <span class="monthly-stats">
                    {{ active_days }} days · {{ total_seconds | format_duration }} · {{ total_miles | format_miles }}
                </span>
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
