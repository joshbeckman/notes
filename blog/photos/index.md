---
layout: Photos
title: Photographs
image: "/assets/images/photography.jpeg"
permalink: "/blog/photos/"
searchable: true
categories:
- blog
serial_number: 2024.PAE.013
---
This is a stream of my favorite photographs.

{% assign photo_feature_posts = site.categories['blog'] | where_exp: "item", "item.photo_feature" %}
{% for photo_feature_post in photo_feature_posts %}
{% assign image_url = photo_feature_post.image %}
{% if photo_feature_post.photo_feature and photo_feature_post.photo_feature != true %}
{% assign image_url = photo_feature_post.photo_feature %}
{% endif %}
<a href="{{ photo_feature_post.url }}" title="{{ photo_feature_post.title | escape}}">
<img class="lazyload no-lightbox" data-src="{{ image_url }}" alt="{{ photo_feature_post.title | escape }}" height="200px" width="100%"/>
</a>
{% endfor %}
