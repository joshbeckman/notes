---
layout: Page
title: Sequences
permalink: /sequences/
searchable: true
tags:
- index
- personal-blog
serial_number: 2025.PAE.004
---
These are post sequences: chains of posts where each links to the next. The minimum sequence length is 4 posts (two is just a link, and there are too many 3-link chains). Sequences can be used to explore a thought in depth, following a curated path through related posts, notes, and comments. Read about [how these are found](https://www.joshbeckman.org/blog/tracing-sequences-and-finding-anchors). (See also: [Anchors](/anchors).)

The sequences are ordered by length, with the longest first. So far, there are {{ site.data.sequences.size }} known sequences.

{% for sequence in site.data.sequences %}
<h2 id="{{sequence.id}}">{{ sequence.topic | default: "Untitled" }} Sequence ({{ sequence.posts.size }} posts) <a href="#{{sequence.id}}">#</a></h2>

Primary topic: <a href="/search/?q=%27{{ sequence.primary_tag }}&keys=tags" class="">{{ sequence.primary_tag | default: "No topic specified" }}</a>
{% if sequence.start_date and sequence.end_date %}
*{{ sequence.start_date | date: "%B %Y" }} - {{ sequence.end_date | date: "%B %Y" }}*
{% endif %}

<ol>
{% for post in sequence.posts %}
  <li><a href="{{ post.url }}">{{ post.title }}</a>
  {% unless forloop.last %}
  &rarr;
  {% endunless %}
  </li>
{% endfor %}
</ol>

{% endfor %}


