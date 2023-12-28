---
layout: Page
title: About
permalink: /about/
content-type: eg
toc: true
---

I [wrote up the process and theory behind this website](https://www.joshbeckman.org/opening-up-my-highlights-notes/), but basically it's an export and reformatting of my highlights and notes of my online (and some offline) reading ([script here](https://github.com/joshbeckman/notes/blob/master/utilities/import_action)).

I use it to jostle loose ideas when I'm researching a particular problem in software design or writing topic.
I usually either ask it for a random note or search by keyword.

## Features

Posts and pages and notes can link to each other, and backlinks are shown when present.
This allows for two-way linking of ideas.

Search (on the homepage and on a [dedicated page](/search)) allows you to find anything without having to use an external search engine.

Pages and posts support table-of-contents rendering, metadata about citation/sourcing, Readwise integration, `h-card` markup (for webmention support), and more coming soon.

## Infrastructure

The site theme was originally forked from [Simply Jekyll](https://github.com/raghudotcc/simply-jekyll) and has slowly been rewritten and refactored over time.

This site's source code lives on [[Github::https://github.com/joshbeckman/notes]] and is served using GitHub Pages.

This website is statically generated using [Jekyll](https://jekyllrb.com) from a set of Markdown files.

Search is powered by [lunrjs](https://lunrjs.com).
The site fonts are [IBM Plex](https://www.ibm.com/plex/).
Webmentions are supported via [webmention.io](https://webmention.io).

## About Me

I'm an experienced startup operator with a history of scaling tech and teams. I'm a self-taught software developer, (and tech lead, and manager, yadda yadda) with a much wider-ranging career and education before that. I strive to bring curiosity, encouragement, and first-principles thinking to the work I'm doing.

I'm currently working as a Senior Staff Developer at Shopify.

You can [read more about me on my main website](https://www.joshbeckman.org/about).

## Changelog

### Unreleased
* change styling/colors by season
* Move webmentions into static ingestion and rendering
* featured image on post
* photo gallery support
* move content markup into liquid filters instead of liquid logic
* make backlinks and related/same-source rendering more efficient

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
