---
title: Building an "On This Day" Feature for My Jekyll Site
date: '2025-06-11 08:00:00'
bluesky_status_url: false
mastodon_social_status_url: false
tags:
- jekyll
- code-snippets
- personal-blog
---

I've always been drawn to the little moments of rediscovery that my Day One journal creates with its "On This Day" feature. It's delightful to stumble across a post you wrote years ago on the same date. So I decided to implement a similar feature on my Jekyll site, allowing me to revisit past posts from the same day in my history.

## The Simple Solution

The implementation turned out to be elegantly straightforward. Jekyll's Liquid templating system gives you everything you need to filter posts by date patterns. Here's the core logic I landed on:

```liquid
{% raw %}
{% assign today = site.time | date: "%m-%d" %}
{% for post in site.posts %}
{% assign post_date = post.date | date: "%m-%d" %}
{% if post_date == today %}
{%- include PostListItem.html post=post dated=true -%}
{% endif %}
{% endfor %}
{% endraw %}
```

The magic happens in those date filters. I extract just the month and day (`%m-%d`) from both the current date and each post's date, then match them up. Posts that share today's month-day combination get displayed.

## Breaking Down the Components

**Date Extraction**: `site.time | date: "%m-%d"` grabs today's date in MM-DD format. Jekyll automatically provides `site.time` as the current build time.

**Post Iteration**: The loop runs through every post in `site.posts`, which Jekyll populates from all your `_posts` directories.

**Pattern Matching**: By comparing just the month-day portion, I catch posts from any year that happened on this date.

**Presentation**: I reuse my existing `PostListItem.html` include, but pass `dated=true` to show the full date (including year) since that context matters for "memory" posts.

## The Page Structure

I created a simple page at `/on-this-day.md` with Jekyll's Page layout:

```yaml
---
layout: Page
title: On This Day
searchable: true
tags:
- index
- personal-blog
---
```

The page includes a brief explanation and links to my [heatmap calendar](/heatcal) ([details on how that is built](https://www.joshbeckman.org/blog/a-heatmap-calendar-for-my-site)) for deeper exploration. It's tagged as an index page so it appears in my site navigation.

## What I Like About This Approach

**Zero Dependencies**: No plugins, no external services, just core Jekyll functionality.

**Fast Performance**: The date matching happens during site generation, not at runtime. The page loads instantly.

**Cross-Category**: Since I loop through `site.posts`, it catches everything - blog posts, notes, exercise logs, replies. The variety makes the feature more interesting.

## Potential Enhancements

There are some obvious directions this could go:

- **Date Range**: Show posts from this week in history, not just this exact date
- **Extract as Plugin**: Create a reusable Jekyll plugin for this feature

But honestly, the current implementation works perfectly for my needs. It's one of those features where the simple solution is often the right solution.

## The Broader Pattern

What I appreciate most is how this fits into Jekyll's philosophy of doing complex things with simple tools. The same date filtering technique powers other chronological features - anniversary posts, seasonal collections, or historical timelines.

It's also a good reminder that sometimes the best features are the ones that emerge naturally from your existing tools. I didn't need to reach for anything fancy here. Jekyll's built-in date handling and Liquid templating were more than sufficient to create something genuinely useful.

If you're running a Jekyll site and want to add this kind of retrospective feature, give it a try. The code is minimal, the maintenance is zero, and the occasional rediscovery of old posts is surprisingly rewarding.
