---
layout: Page
title: Replies & Threads
searchable: true
emoji: 🧵
tags:
- index
---

This is still a work-in-progress.

Right now, this just pulls in replies I make on Mastodon.

Going to be pulling in replies from:
- blog posts I'd like to comment on
- [Hacker News comments](https://news.ycombinator.com/threads?id=bckmn)
- [bluesky replies](https://bsky.app/profile/joshbeckman.org)
- [letterboxd reviews](https://letterboxd.com/joshbeckman/activity/)

---

{% for post in site.categories['replies'] %}
{%- include PostListItem.html post=post -%}
{% endfor %}
