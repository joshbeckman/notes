---
layout: Page
title: Anchors
searchable: true
tags:
- index
- personal-blog
---

These are anchor posts: the top 5% of posts with the most backlinks, providing anchoring weight for the site. These posts act as central hubs that other content naturally gravitates toward and references. (See also: [Sequences](/sequences/).)

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
