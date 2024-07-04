---
layout: Page
title: About This Site
searchable: true
tags:
- index
- personal-blog
---

I [wrote up the process and theory behind this website](https://www.joshbeckman.org/opening-up-my-highlights-notes/), but basically it's an export and reformatting of my highlights and notes of my online (and some offline) reading ([script here](https://github.com/joshbeckman/notes/blob/master/utilities/import_action)).

I use it to jostle loose ideas when I'm researching a particular problem in software design or writing topic.
I usually either ask it for a random note or search by keyword.

## Features

Posts and pages and notes can link to each other, and backlinks are shown when present.
This allows for two-way linking of ideas.

Search (on the homepage and on a [dedicated page](/search)) allows you to find anything without having to use an external search engine.

Pages and posts support table-of-contents rendering, metadata about citation/sourcing, Readwise integration, `h-card` markup (for webmention support), and more.

## Infrastructure

The site theme was originally forked from [Simply Jekyll](https://github.com/raghudotcc/simply-jekyll) and has slowly been rewritten and refactored over time.

This site's source code lives on [[Github::https://github.com/joshbeckman/notes]] and is served using GitHub Pages.

This website is statically generated using [Jekyll](https://jekyllrb.com) from a set of Markdown files.

Search is powered by [lunrjs](https://lunrjs.com).
Photo galleries and zoom are powered by [PhotoSwipe](https://photoswipe.com).
The site fonts are [IBM Plex](https://www.ibm.com/plex/).
Network graph views are powered by [vis-network](https://www.joshbeckman.org/blog/building-a-network-graph-site-index).
Popularity is tracked by [Goatcounter](https://www.goatcounter.com/) - public stats are available at [/analytics](https://www.joshbeckman.org/analytics).
Comments are powered by [Cusdis](https://cusdis.com/).
Serverless scripts (e.g. for [generating insights](/insight)) are hosted/run by [Val Town](https://www.val.town).

You can read about everything else I use to build things at [/uses](/uses).

## Changelog

### Unreleased
- better h-card markup for posts
- `/projects` page
- `/now` page ([ref](https://nownownow.com/about#who))
- Random image on homepage
- podcast rendering
* move content markup into liquid filters instead of liquid logic

### 2024-06-22
- Switching off Tinylitics and over to Goatcounter for analytics

### 2024-06-16
- Post to mastodon via GitHub action build pipeline (POSSE)
- Add comments via [Cusdis](https://cusdis.com/)
- Add a [guestbook](/guestbook) page

### 2024-06-01
- Added Tinylitics as an experiment

### 2024-05-27
- Render search results statically

### 2024-05-26
- Add "post via GitHub issue" feature

### 2024-03-02
- Display ["recently read" and "reading inbox"](/blog/reading/reading_list) articles from Reader API

### 2024-02-28
- [`/uses` page](/uses) ([ref](https://uses.tech))
- podroll and blogroll posts/tags

### 2024-02-19
- [Network/map display of all posts](/network) (to find edges of the garden [needing weeding](https://www.joshbeckman.org/blog/weeding-the-edges))
- Network display on each post (to walk the garden path)
- Walking path display on the network (based on session)

### 2024-02-17
- Print and PDF styling of posts

### 2024-02-03
- Enabled PWA offline capabilities

### 2024-02-01
- Add "Feeling Lucky" mode to the search page.

### 2024-01-24
- optimize images for web sizes/rendering

### 2024-01-15
- Redesign the site to double-column layout
- Add notepad to posts and pages
- Introduced seasons

### 2024-01-06
* Featured image support on posts
- Migrate the blog content from Ghost into this site
  - Create a category page for the blog
  - create a category for books
  - create a category for concerts
  - create a category for movies
  - create a category for desks
  - create a category for talks
  - `/subscribe` page
  - `/narro` page
  - `/contact` page

### 2023-12-29
* Photo gallery and zoom support
- Linking books via Amazon ASIN (though we hate Amazon, it's all we can get from Readwise's API)

### 2023-12-27
- New theme implemented (major simplification)
- Update link styling to suppprt `visited` state

### 2023-06-22
- Implemented decimal index

### 2023-06-09
- Printable styling and QRCodes

### 2023-05-01
- Highlight text fragments in outbound links

### 2023-03-05
- Send Webmentions with GitHub Actions

### 2023-03-04
- Switch to GitHub Actions for build

### 2023-03-01
- Add Webmention display support

### 2023-02-16
- Styled with Tufte.css

### 2023-02-11
- Added Random Note page

### 2023-02-11
- Search-via-URL-query support

### 2023-01-11
- Tags added to search results

### 2023-02-09
- Forked from Original Theme
