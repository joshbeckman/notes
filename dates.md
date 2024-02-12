---
layout: Post
title: Site Index By Date
permalink: /dates/
tags: index
---

{% assign postsByDay = 
site.posts | group_by_exp:"post", "post.date | date: '%d-%B-%Y'" %}
{% for day in postsByDay %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  <ul class="">
      {% for post in day.items %}
        <li style="">
          <a href="{{post.url}}">
            {% if post.hide_title %}
            {{ post.content | strip_html | strip | escape | truncate: 70}}
            {% else %}
            {{ post.title }}
            {% endif %}
            {% if post.author %}
            <em>from {{ post.author }}</em>
            {% endif %}
          </a>
        </li>
      {% endfor %}
  </ul>
{% endfor %}
