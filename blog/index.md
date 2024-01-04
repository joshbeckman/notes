---
layout: Page
title: Blog
toc: true
---

This is a general blog.

{% for post in site.categories['blog'] %}
[{{post.title}}]({{post.url}}) {{post.date | date_to_string}}
{% endfor %}
