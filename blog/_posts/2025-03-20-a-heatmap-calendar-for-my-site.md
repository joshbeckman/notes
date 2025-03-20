---
layout: Post
date: 2025-03-20 13:05:52 +0000
title: "A Heatmap Calendar for My Site"
toc: true
image: /assets/images/ee8815cf-8280-44b0-8e8f-02721dc1d814.png
description: 
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114195966414844441
bluesky_status_url: false
tags:
  - personal-blog visualization
---


<img width="634" alt="Heatmap calendar" src="/assets/images/ee8815cf-8280-44b0-8e8f-02721dc1d814.png" />

Over the weekend I built a new page on this site: [the Heatcal](/heatcal). It's just a simple visualization of the posts I've made as a heat map on a calendar grid. Darker dates have more posts. Clicking on a date can show you the posts on that day.

I missed the full date index that I used to have in a previous version of this site, where I could scroll through the full timeline of things I've written. And this visual display is super easy to scan - most of what I get as I scroll down the page is a sense of my creative output waxing and waning over time. I've come to embrace that more and more this last year.

Using this in tandem with the [On This Day](/on-this-day) page has been a very nice way to reinforce my memory each morning.

## Technical Details

The page uses the same JSON index of posts that the *Search* and *Random* and *Insight* pages use to pull in and index all posts. Then it reduces them to a list of dates and passes that to an instance of [Cal-Heatmap](https://cal-heatmap.com/) that has been loaded onto the page. Annoyingly, I found that the docs for that JavaScript library are kind of misleading: I had to configure all options (even some of the ones that say they have a default) to get the library to render correctly.

It's not incredibly performant to load *all* the posts on the page - without pagination - but today's pocket computers are fast and I really value the simple vertical scrolling.
