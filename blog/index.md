---
layout: Page
title: Blog
toc: true
---

This is a general blog.

{% assign postsByMonth = 
site.categories['blog'] | group_by_exp:"post", "post.date | date: '%Y %B'" %}
{% for day in postsByMonth %}
  <h3 id="{{ day.name }}">{{ day.name }}</h3>
  <ul class="">
      {% for post in day.items %}
        <li style="">
          <a href="{{post.url}}">
            {{ post.title }}
          </a>
        </li>
      {% endfor %}
  </ul>
{% endfor %}
