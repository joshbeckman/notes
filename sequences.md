---
layout: Page
title: Sequences
searchable: true
---

These are post sequences: chains of posts where each links to the next. The minimum sequence length is 3 posts (two is just a link). Sequences can be used to explore a thought in depth, following a curated path through related posts, notes, and comments.

The sequences are ordered by length, with the longest first.

{% for sequence in site.data.sequences %}
<h2 id="{{sequence.id}}">{{ sequence.topic | default: "Untitled" }} Sequence ({{ sequence.posts.size }} posts) <a href="#{{sequence.id}}">#</a></h2>

Topic: <a href="/search/?q=%27{{ sequence.topic }}&keys=tags" class="">{{ sequence.topic | default: "No topic specified" }}</a>
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


