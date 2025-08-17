---
layout: Page
title: Photographs
image: /assets/images/photography.jpeg
permalink: /blog/photos/
categories:
- blog
serial_number: 2024.PAE.008
---

{% assign photo_feature_posts = site.categories['blog'] | where_exp: "item", "item.photo_feature" %}
{% for photo_feature_post in photo_feature_posts %}
{% assign image_url = photo_feature_post.image %}
{% if photo_feature_post.photo_feature and photo_feature_post.photo_feature != true %}
{% assign image_url = photo_feature_post.photo_feature %}
{% endif %}
<a href="{{ photo_feature_post.url }}" title="{{ photo_feature_post.title | escape}}">
<img src="{{ image_url }}" alt="{{ photo_feature_post.title | escape }}" class="no-lightbox"/>
</a>
{% endfor %}
