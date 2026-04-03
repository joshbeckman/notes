---
layout: Page
title: Uncommented Notes
permalink: "/uncommented/"
emoji: "\U0001F4DD"
searchable: true
tags:
- index
- personal-blog
serial_number: 2026.PAE.009
---
These are notes that contain only a highlight or quote with no original commentary. Pick one to [suggest comments](/suggest/) for.

{% assign uncommented_notes = site.posts | where: "uncommented", true | reverse %}

<button id="random-suggest">Random Note</button>
<script>
document.getElementById('random-suggest').addEventListener('click', function() {
  var urls = [{% for post in uncommented_notes %}"{{ post.url | url_encode }}"{% unless forloop.last %},{% endunless %}{% endfor %}];
  var pick = urls[Math.floor(Math.random() * urls.length)];
  window.location.href = '/suggest/?post=' + pick;
});
</script>

<table>
<thead>
<tr>
<th>Note</th>
<th>Tags</th>
<th></th>
</tr>
</thead>
<tbody>
{% for post in uncommented_notes %}
<tr>
<td><a href="{{ post.url }}">{{ post.title | truncate: 60 }}</a></td>
<td>{{ post.tags | join: ", " }}</td>
<td><a href="/suggest/?post={{ post.url | url_encode }}">Suggest</a></td>
</tr>
{% endfor %}
</tbody>
</table>

{{ uncommented_notes.size }} notes need commentary.
