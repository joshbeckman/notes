---
layout: Post
title: Decimals Index
permalink: /decimals/
content-type: eg
---

<p>
There are categories; they are used as tags.
Any note can be tagged with one or more categories.
The numbers don't matter; what matters is that they are numerically sorted and numerically related.
</p>

<p>
Alternatively, notes are <a href="/dates">indexed by date</a>.
</p>

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
          <li style="padding-bottom: 0.6em; list-style: none;">
            <a href="{{post.url}}">
              {{ post.title }}
            </a>
          </li>
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
          <li style="padding-bottom: 0.6em; list-style: none;">
            <a href="{{post.url}}">
              {{ post.title }}
            </a>
          </li>
        {% endfor %}
      </ul>
      {%- endif -%}
    {% endfor %}
  {%- endif -%}

  {%- if slug == 'inbox' -%}
    {% for tag in site.tags %}
      {%- assign is_in_inbox = tag.first | tag_in_inbox -%}
      {%- if is_in_inbox -%}
      <ul class="">
        {% for post in tag.last %}
          <li style="padding-bottom: 0.6em; list-style: none;"><a href="{{post.url}}">
            {{ post.title }} <em id="{{ tag.first }}">({{ tag.first }})</em>
          </a></li>
        {% endfor %}
      </ul>
      {%- endif -%}
    {% endfor %}
  {%- endif -%}

{%- endfor -%}
