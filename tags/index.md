---
layout: Page
title: Site Index by Topic
permalink: /tags/
tags: index
---

{%- for item in site.data.decimals -%}
  {%- assign slug = item | split: ' ' | last | downcase -%}
  {%- assign decimal = item | split: ' ' | first -%}
  {%- assign top = item | match: '^\d\d-\d\d ' -%}
  {%- assign mid = item | match: '^\d\d ' -%}
  {%- if top -%}
    <h2 id="{{ slug }}">{{ item }}</h2>
  {%- elsif mid -%}
    <h2 id="{{ slug }}">{{ item }}</h2>
    {%- for tag in site.tags %}
      {%- if tag.first == slug -%}
      <ul class="">
        <li>
          <a href="/insight?topic={{ slug | split: '-' | join: ' ' | url_encode }}">💡 Insight</a>
        </li>
        <li>
          <a href="/search?q=%27{{ slug | split: '-' | join: ' ' | url_encode }}&keys=tags">All Posts</a>
        </li>
      </ul>
      {%- endif -%}
    {% endfor %}
  {%- else -%}
    <h3 id="{{ slug }}">{{ item }}</h3>
    {%- for tag in site.tags %}
      {%- if tag.first == slug -%}
      <ul class="">
        <li>
          <a href="/insight?topic={{ slug | split: '-' | join: ' ' | url_encode }}">💡 Insight</a>
        </li>
        <li>
          <a href="/search?q=%27{{ slug | split: '-' | join: ' ' | url_encode }}&keys=tags">All Posts</a>
        </li>
      </ul>
      {%- endif -%}
    {% endfor %}
  {%- endif -%}

  {%- if slug == 'inbox' -%}
    <ul class="">
    {% for tag in site.tags %}
      {%- assign is_in_inbox = tag.first | tag_in_inbox -%}
      {%- if is_in_inbox -%}
        {% for post in tag.last %}
          <li style=""><a href="{{post.url}}">
            {{ post.content | strip_html | strip | escape | truncate: 70}} <em id="{{ tag.first }}">({{ tag.first }})</em>
          </a></li>
        {% endfor %}
      {%- endif -%}
    {% endfor %}
    {% for post in site.posts %}
    {% if post.tags.size == 0 %}
      <li style=""><a href="{{post.url}}">
        {{ post.title | strip_html | strip | escape | truncate: 70}}
      </a></li>
    {% endif %}
    {% endfor %}
    </ul>
  {%- endif -%}

{%- endfor -%}
