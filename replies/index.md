---
layout: Page
title: Replies & Threads
searchable: true
emoji: 🧵
tags:
- index
- mastodon
- bluesky
- social-networks
---

Replies I make on Mastodon and Bluesky and other social networks. Always adding more [syndication](https://www.joshbeckman.org/blog/rules-for-syndication-on-my-site).

Going to be pulling in replies from:
- blog posts I'd like to comment on
- [Hacker News comments](https://news.ycombinator.com/threads?id=bckmn)

---

{% for post in site.categories['replies'] %}
{%- include PostListItem.html post=post -%}
{% endfor %}
