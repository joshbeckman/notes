---
layout: Page
title: Lists
toc: true
searchable: true
tags:
- index
---
{%- for list in site.data.lists -%}
<h2 id="{{list.title | slugify}}">
    {{list.title}}
</h2>
<ul>
  {% for item in list.items %}
  <li>
    <a href="{{item.url}}" target="_blank">{{item.url | domainify}}</a> &mdash; {{item.description}}
  </li>
  {% endfor %}
</ul>
{%- endfor -%}
