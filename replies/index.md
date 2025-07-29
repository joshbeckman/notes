---
layout: Page
title: Replies & Threads
searchable: true
emoji: "\U0001F9F5"
tags:
- index
- mastodon
- bluesky
- social-networks
serial_number: 2024.PAE.027
---
Replies I make on social networks and other external sites, mirrored here for completeness and archival reference. Always adding more [syndication](https://www.joshbeckman.org/blog/rules-for-syndication-on-my-site).

---

{% for post in site.categories['replies'] %}
{%- include PostListItem.html post=post dated=true -%}
{% endfor %}
