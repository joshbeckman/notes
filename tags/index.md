---
layout: Page
title: Site Index by Topic
permalink: /tags/
toc: true
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
        {% for post in tag.last %}
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
        {% for foo in site.pages %}
        {%- if foo.tags contains slug -%}
          <li style="">
            <a href="{{foo.url}}">
            {{ foo.title }}
            </a>
          </li>
        {%- endif -%}
        {% endfor %}
      </ul>
      {%- endif -%}
    {% endfor %}
  {%- else -%}
    <h3 id="{{ slug }}">{{ item }}</h3>
    {%- for tag in site.tags %}
      {%- if tag.first == slug -%}
      <ul class="">
        {% for post in tag.last %}
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
        {% for foo in site.pages %}
        {%- if foo.tags contains slug -%}
          <li style="">
            <a href="{{foo.url}}">
            {{ foo.title }}
            </a>
          </li>
        {%- endif -%}
        {% endfor %}
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
        {{ post.title | strip_html | strip | escape | truncate: 70}} <em>(untagged)</em>
      </a></li>
    {% endif %}
    {% endfor %}
    </ul>
  {%- endif -%}

{%- endfor -%}
