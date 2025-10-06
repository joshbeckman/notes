---
layout: Page
title: Latest Posts
hide_title: true
permalink: "/latest/"
tags: index
serial_number: 2025.PAE.010
---
Here are the latest 10 posts on the site:

{% for post in site.posts limit:10 %}
  {%- include PostListItem.html post=post dated=true -%}
{% endfor %}
