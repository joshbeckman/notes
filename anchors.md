---
layout: Page
title: Anchors
permalink: /anchors/
searchable: true
tags:
- index
- personal-blog
serial_number: 2025.PAE.005
---
These are anchor posts: the top 5% of posts with the most backlinks, providing anchoring weight for the site. These posts act as central hubs that other thinking and posts naturally gravitate toward and references. Read about [how these are found](https://www.joshbeckman.org/blog/tracing-sequences-and-finding-anchors). (See also: [Sequences](/sequences).)

The anchors are ordered by number of backlinks, with the most-referenced first.

{% for anchor in site.data.anchors %}
<h3><a href="{{ anchor.url }}">{{ anchor.title }}</a></h3>

Anchoring {{ anchor.backlink_count }} posts:
<ul>
{% for backlink in anchor.backlinks %}
  <li><a href="{{ backlink.url }}">{{ backlink.title }}</a></li>
{% endfor %}
</ul>

{% endfor %}
