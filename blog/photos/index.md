---
layout: Page
title: Photography
emoji: 🏞️
categories:
- blog
---
{% assign photo_feature_post = site.categories['blog'] | find_exp: "item", "item.photo_feature" %}
<a href="{{ photo_feature_post.url }}">
    <img src="{{ photo_feature_post.photo_feature }}" alt="{{ photo_feature_post.title }}" class="no-lightbox"/>
</a>

This is still a work-in-progress - for now, I'd just go browse photos on [the main blog index](/blog).

Check back in the future.

Probably something like https://css-tricks.com/piecing-together-approaches-for-a-css-masonry-layout/ or https://macwright.com/photos/ or https://darrinhenein.com/photos/
