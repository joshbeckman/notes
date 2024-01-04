---
layout: Page
title: Index
permalink: /tags/
content-type: eg
toc: true
---

<p>
There are categories; they are used as tags.
Any note can be tagged with one or more categories.
The numbers don't matter; what matters is that they are numerically sorted and numerically related.
</p>

<p>
The system structure and theory is roughly based on the ideas of <a href="https://johnnydecimal.com" target="_blank">Johnny.Decimal</a>.
I initially took inspiration from <a href="https://en.wikipedia.org/wiki/Dewey_Decimal_Classification" target="_blank">Dewey Decimal Classification</a>, but diverged when I saw its racist/sexist grouping and when I started embracing my own focus.
  Categories are maintained <a href="https://github.com/joshbeckman/notes/blob/master/_data/decimals.yml">here</a>.
</p>

<p>
Alternatively, things are <a href="/dates">indexed by date</a> or <a href="/sources">by source</a>.
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
          <li style="">
            <a href="{{post.url}}">
              {{ post.content | strip_html | strip | escape | truncate: 70}}
              <em>from {{ post.author }}</em>
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
          <li style="">
            <a href="{{post.url}}">
              {{ post.content | strip_html | strip | escape | truncate: 70}}
              <em>from {{ post.author }}</em>
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
          <li style=""><a href="{{post.url}}">
            {{ post.content | strip_html | strip | escape | truncate: 70}} <em id="{{ tag.first }}">({{ tag.first }})</em>
          </a></li>
        {% endfor %}
      </ul>
      {%- endif -%}
    {% endfor %}
  {%- endif -%}

{%- endfor -%}
