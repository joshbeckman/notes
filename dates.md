---
layout: Post
title: By Date
permalink: /dates/
content-type: eg
---

{% assign postsByDay = 
site.posts | group_by_exp:"post", "post.date | date: '%d-%B-%Y'" %}
{% for day in postsByDay %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  <ul class="">
      {% for post in day.items %}
        <li style="">
          <a href="{{post.url}}">
            {{ post.content | strip_html | strip | escape | truncate: 70}}
            <em>from {{ post.author }}</em>
          </a>
        </li>
      {% endfor %}
  </ul>
{% endfor %}
