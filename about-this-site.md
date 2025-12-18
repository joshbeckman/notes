---
layout: Page
title: About This Site
searchable: true
tags:
- index
- personal-blog
redirect_from:
- "/colophon"
serial_number: 2024.PAE.015
---
This site is my way of [working in the open](https://www.joshbeckman.org/opening-up-my-highlights-notes/) - a public repository of my knowledge, research, and writing that serves both as a personal memory aid and a resource I share with others.

### [Notes](/notes)

My primary knowledge collection, imported from [Readwise/Reader](https://readwise.io/read) highlights of online content and physical book reading, plus manual notes from conversations with peers. I use these as supporting research for my writing and as a memory aid for my work.

### [Blog](/blog)

All of my original writing, including essays, personal life stories, travel writing, and reviews of concerts, movies, and music.

### [Exercise](/exercise)

My exercise log from recent years, which I use to reflect on my health and explore my environment.

### [Replies](/replies)

Cross-posted replies I make on social networks and other external sites, archived here for completeness and reference.

### Pages

Various personal projects and reference content (social accounts, newsletter signup, etc.).

### Tools

I also build lots and lots of tools to help me make the most of my writing and knowledge collection.

## How I Use It

I regularly review my posts to discover new connections and add links between them. The dense interlinking and backlink display creates a cross-pollination effect that helps surface related ideas. I don't have a rigid research-to-writing workflow, but the site helps me identify patterns and develop new ideas over time.

For syndication, I follow [specific rules](https://www.joshbeckman.org/blog/rules-for-syndication-on-my-site) to ensure content works well both on my site and on external platforms without losing context.

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

The site fonts are [IBM Plex](https://www.ibm.com/plex/) and [Berkeley Mono](https://berkeleygraphics.com/typefaces/berkeley-mono/).

Network graph views are powered by [vis-network](https://www.joshbeckman.org/blog/building-a-network-graph-site-index).

Popularity is tracked by [Goatcounter](https://www.goatcounter.com/) - public stats are available at [/analytics](https://www.joshbeckman.org/analytics).

Guestbook comments are powered by [Cusdis](https://cusdis.com/).

Webmentions are received at [webmention.io](https://webmention.io/api/mentions.html?token=4N8Bpl6KX64j8VB4k5A3ww).

Serverless scripts (e.g. for [generating insights](/insight)) are hosted/run by [Val Town](https://www.val.town).

You can read about everything else I use to build things at [/uses](/uses).

## Stats

{% assign build_time = site.time | date_to_xmlschema %}
{% assign oldest_post = site.posts | last %}
{% assign newest_post = site.posts | first %}
- Site version: {{site.version}}
- Build time: <time datetime="{{ build_time }}">{{ build_time }}</time>
- Posts count: {{site.posts.size}}
- [Tags](/tags) count: {{ site.tags.size }}
- First post date: <time datetime="{{ oldest_post.date | date_to_xmlschema }}">{{ oldest_post.date | date: "%B %d, %Y" }}</time>
- Last post date: <time datetime="{{ newest_post.date | date_to_xmlschema }}">{{ newest_post.date | date: "%B %d, %Y" }}</time>

## Changelog

### 2025-12-17
- Add [exercise stats page](/exercise/stats) with line charts for hours, miles, and average duration per month
- Add monthly aggregate stats (active days, total time, miles) to [exercise index](/exercise)

### Unreleased
- `/projects` page
- podcast rendering
- [More ideas](https://github.com/joshbeckman/notes/issues?q=is%3Aopen+is%3Aissue+-label%3Apost)

### 2025-11-29
- Add advanced search filters: restrict by field (title, content, tags, etc.), document type, category, and date range
- Support `q=*` wildcard to return all documents for filter-only searches

### 2025-11-16
- Default to showing comments section
- Add HackerNews comments/points display
- Add webmention count display and form to submit them

### 2025-09-14
- Site layout redesign ([details](/blog/practicing/website-redesign))

### 2025-08-20
- Render next/previous posts in the same subcategory on post pages

### 2025-08-17
- Add a [basic photos page](/blog/photos) to display photo-featured posts

### 2025-07-04
- Import videos from YouTube as blog posts

### 2025-06-29
- Add [Daily Review](/notes/daily-review) page to display daily reviews from Readwise

### 2025-06-07
- Add [Anchors](/anchors) page to display posts with most backlinks
- Bring back the comments section on posts
- Display Mastodon and Bluesky replies/like counts on posts

### 2025-06-01
- Add [Sequences](/sequences) page to display linked posts in a sequence

### 2025-05-18
- Importing Reader top-level document notes as Notes posts

### 2025-03-15
- Add a [Heatmap Calendar](/heatcal) of posts

### 2024-12-21
- Import posts from Bluesky as posts and replies

### 2024-12-15
- [Import reviews from Letterboxd](https://www.joshbeckman.org/blog/crossposting-from-letterboxd-to-jekyll) as blog posts

### 2024-12-08
- [Add link facets to Bluesky syndication](https://www.joshbeckman.org/blog/bluesky-website-embeds-ruby)

### 2024-12-07
- [Import posts from Mastodon](https://www.joshbeckman.org/blog/pesos-mastodon-to-jekyll) as replies and blog posts

### 2024-12-02
- Switch back to variable fonts
- Refactor general post layout and headings

### 2024-12-01
- Switch to monospace fonts
- POSSE notes to Mastodon and Bluesky
- import posts from Mastodon as replies
- replies page
- insights inline on the post page itself
- backlinks powered by the same data that provides the network linkages
- `ReplyTo` as extractable content and used to link

### 2024-11-24
- Redesign the homepage to be more like a directory

### 2024-09-07
- Add conversation support to insight page

### 2024-09-06
- Add insight generation for posts and tags

### 2024-07-16
- Add lazy-loading support for images in post lists

### 2024-07-13
- [Switch search library from Lunr.js to Fuse.js](https://www.joshbeckman.org/blog/switching-search-from-lunrjs-to-fusejs)

### 2024-07-04
- [Add Insight page](https://www.joshbeckman.org/blog/using-an-llmand-rag-to-wring-insights-from-my-posts)

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
