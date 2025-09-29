---
layout: Page
title: Latest Posts
hide_title: true
permalink: "/latest/"
tags: index
---

Here are the latest 10 posts on the site:

{% for post in site.posts limit:10 %}
  {%- include PostListItem.html post=post dated=true -%}
{% endfor %}
