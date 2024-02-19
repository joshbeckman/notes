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
Webmentions are supported via [webmention.io](https://webmention.io).

## Changelog

### Unreleased
- podroll and blogroll posts/tags
- better h-card markup for posts
- `/projects` page
- `/now` page ([ref](https://nownownow.com/about#who))
- `/uses` page ([ref](https://uses.tech))
- Random image on homepage
- podcast rendering
* make backlinks and related/same-source rendering more efficient
* move content markup into liquid filters instead of liquid logic
* change styling/colors by season
* Move webmentions into static ingestion and rendering
- Post to mastodon or something via GitHub action build pipeline
- "Collect" posts/notes into a markdown block (like the old scratchpad thing)
  - And export contents as epub?
  - And export to a URL that can rebuild the post/content? (shareable assemblage of notes)
  - display the path on a map of notes?
- Display "recently read" and "reading inbox" articles from Reader API

### 2024-02-19
- [Network/map display of all posts](/network) (to find edges of the garden [needing weeding](https://www.joshbeckman.org/blog/weeding-the-edges))
- Network display on each post (to walk the garden path)

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
