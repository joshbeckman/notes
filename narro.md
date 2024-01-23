---
layout: Page
toc: true
title: Narro
image: "/assets/images/apps.png"
date: '2023-01-30 04:17:14'
permalink: /narro/
tags: narro
---
![Narro](/assets/images/apps.png)

Narro was a service I operated from 2014-2023 and a company I operated from 2016-2023 that turned your reading list or blog into a podcast. It was the best way to listen to the internet. As one user said: "Pretty much the best thing to happen to your morning commute since the iPod."

For readers and consumers, it provided a way to send articles, ebooks, PDFs, videos, and plain text to a single source and have them transcribed via text-to-speech into a personal podcast.

For publishers, it provided a way to programmatically turn a blog or other feed into a brandable podcast for their audience. Public podcasts also came with audience engagement and demographic metrics.

For advertisers, it offered the ability to upload ads and bid on placement for them into semantically-relevant audio readings for free accounts on the platform. Ad placement also came with click tracking and audience measurement.

<figure class="kg-card kg-image-card"><img src="/assets/images/narro.png" class="kg-image" alt  width="900" height="186"  sizes="(min-width: 720px) 720px"></figure>

## History

I had a long commute into my first job in Chicago. Somehow I figured out how to pipe text into the `say` command on my Mac OSX laptop. I would manually extract text from articles I wanted to read online, pass that into a script I wrote to use this text-to-speech command, and then save the result into an audio file. I would upload those audio files into my iPod and listen to them on my commute. This was in 2013.

Soon, I was experimenting with [Festival TTS](https://www.cstr.ed.ac.uk/projects/festival/), building a Node.js API and server so that I could send copied text into speech synthesis via API. I paid a Mac Mini colocation company to host a PHP script so that I could use the Mac speech synthesis tooling as an API. No good, performant TTS APIs existed in the ecosystem at this time. 2-3 years later Amazon and eventually Google would start offering TTS APIs and voice agents.

In 2014, I had gotten a good article text extraction algorithm written and opened up Narro as a SaaS tool where anyone could sign up and then use a bookmarklet to send any public web page for text scraping and text-to-speech synthesis. Users could select a voice, reading/speaking speed, and more. After a free trial, users could get unlimited readings for a $3/mo subscription (processed via Stripe's brand new subscription billing model). Each account came with a podcast URL to listen to the resulting readings. This was the first real version of Narro!

From there, I continued adding more voices, natural language processing, language detection and localization, better text extraction from more sources, etc. Eventually Amazon released their Polly TTS engine and many more voice options became available. I built out a public API, many integrations into automation services, article ingestion sources, mobile phone apps, and a Chrome extension.

In 2016 Stripe launched a beta of their [Atlas program](https://stripe.com/atlas) and invited me to incorporate Narro as an initial member. Narro [the corporation was formed]( /on-narro-joining-atlas/) and it started gaining more subscribers. Brand marketers had discovered Narro and started using the RSS feed ingestion to turn topical blogs into branded podcasts. I built out the advertisement model and onboarded an advertiser, as well as built out an audience metrics system for reporting engagement. I increased the subscription price to $5/mo to support more expensive speech synthesis.

Over the next few years, Narro's feature set grew as more TTS engines became publicly available, voices became more realistic and palatable, and people became more acquainted with their computers speaking to them. Soon, costs became greater for Narro's most prolific users and so I changed the pricing model to be usage-based instead of a flat monthly subscription.

Heading into the 2020s, Narro's feature set was pretty complete for what users needed. Spam accounts had also discovered Narro as a way to create podcasts and backlink or otherwise promote scams ([I wrote a deep-dive into one example]( /what-spam-accounts-look-like-in-2022/)). Combating spam became a major time and profit sink for me operating the service.

In 2022 I decided to [shut down Narro]( /the-end-of-narro/). Operations ceased in December 2022 and the business was wound down in January 2023. Read more here:

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="/the-end-of-narro/"><div class="kg-bookmark-content">
<div class="kg-bookmark-title">The End of Narro</div>
<div class="kg-bookmark-description">The timeline and reasoning behind why I shut down Narro, the best way to listen to the internet.</div>
<div class="kg-bookmark-metadata">
<img class="kg-bookmark-icon" src="/assets/images/favicon-1.png" alt=""><span class="kg-bookmark-author">Josh Beckman</span><span class="kg-bookmark-publisher">Josh Beckman</span>
</div>
</div>
<div class="kg-bookmark-thumbnail"><img src="/assets/images/Screen-Shot-2023-01-22-at-10.54.43-copy.jpg" alt=""></div></a></figure>
## What I Learned

Early on, Narro was a prime vehicle for me learning new languages (Node.js, Go), pricing theory, customer support, interface design, and much more.

Later I learned about incorporating a business, corporate taxes and finance (I filed most tax years myself), and a taste of the fees/work required to run a corporation.

I taught myself iOS and Android development, database re-platforming strategies, PostgreSQL performance optimization, [frugal computing](https://read.readwise.io/search/read/01gnqhzhb6nkvz2w2y66qvjyw4), domain driven application design, and how to combat [spam accounts]( /what-spam-accounts-look-like-in-2022/) on the modern web. I was the only developer and only operator for the entire life of Narro, so I learned how to deploy and scale the service and its components as it grew.

## Numbers

- Over $2k in monthly revenue at Narro's peak
- 45 thousand Narro accounts
- ~1.5 million readings generated through Narro
- Over 3.5TB of generated audio
- 2GB of uploaded files to generate readings
- Over 3,000 commits to Narro's codebase
- 10 open-sourced libraries and projects ([sponsor ongoing development on GitHub](https://github.com/sponsors/andjosh/))

## Design & Branding

The logo was originally designed by my friend [Josh Martin](https://jawsmartin.com). The 'N' is supposed to imitate a play/pause button, as is the center of the 'o'.

All other site, app, and interface designs were built and hamfistedly refined by myself. The branding and tone was familiar, brief, and focused on the fact that it was a one-person service/company. At the bottom of this page are selections of screenshots from the interfaces.

## Technology Stack

Initial versions of Narro used:

- PHP and Node.js for server logic
- MongoDB for storage

In 2017 Narro outgrew MongoDB's aggregating abilities (for what I wanted to pay) and so I [migrated to PostgreSQL]( /migrating-a-mongodb-app-datastore-to-postgresql/). For most of its life Narro's stack was:

- Application logic written in Node.js
- Podcast server written in Go
- Database storage in PostgreSQL
- Redis for background queues
- Android app written in Java
- iOS app written in Objective-C and then rewritten in Swift
- Chrome extension written in JavaScript
- Inbound and outbound email through Postmark
- Blog hosted by Tumblr
- Source code hosted in GitHub
- Status page and API documentation hosted in GitHub Pages
- Application servers and databases hosted in Heroku
- Generated audio and uploads/assets hosted in AWS
- Text-to-speech integrations with Amazon, Google, Microsoft, and others

## API & Ecosystem

I tried to make Narro a good exemplar of an open player in a larger ecosystem. I opened up Narro's public API in 2016, then used that exact same API to build all future features, apps, and integrations. All of Narro's apps and integrations were OAuth API clients the same as any others.

Narro was integrated into [IFTTT](https://ifttt.com/), allowing users to create and remix their own applications on top of the base functionality (which they definitely _did_). Several users made their own API clients and built services on top of Narro.

## Gallery
<figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container"><div class="kg-gallery-row">
<div class="kg-gallery-image"><img src="/assets/images/narro_1000_netted.jpg" width="1000" height="563"  alt  sizes="(min-width: 720px) 720px"></div>
<div class="kg-gallery-image"><img src="/assets/images/ios_launch.png" width="640" height="1136"  alt ></div>
<div class="kg-gallery-image"><img src="/assets/images/ios_submit-1.png" width="640" height="1136"  alt ></div>
</div></div>
<figcaption>Narro's mobile application</figcaption></figure><figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container">
<div class="kg-gallery-row">
<div class="kg-gallery-image"><img src="/assets/images/Screen-Shot-2023-01-22-at-10.54.43-copy-1.jpg" width="2000" height="1385"  alt  sizes="(min-width: 720px) 720px"></div>
<div class="kg-gallery-image"><img src="/assets/images/Screenshot-2022-12-26-at-1.32.16-PM.png" width="2000" height="1465"  alt  sizes="(min-width: 720px) 720px"></div>
<div class="kg-gallery-image"><img src="/assets/images/Screenshot-2022-12-26-at-1.32.26-PM.png" width="2000" height="1465"  alt  sizes="(min-width: 720px) 720px"></div>
</div>
<div class="kg-gallery-row">
<div class="kg-gallery-image"><img src="/assets/images/Screenshot-2022-12-26-at-1.32.44-PM.png" width="2000" height="1465"  alt  sizes="(min-width: 720px) 720px"></div>
<div class="kg-gallery-image"><img src="/assets/images/Screen-Shot-2023-01-22-at-10.37.11.png" width="2000" height="4693"  alt  sizes="(min-width: 720px) 720px"></div>
</div>
<div class="kg-gallery-row">
<div class="kg-gallery-image"><img src="/assets/images/Screen-Shot-2023-01-22-at-10.38.58.png" width="2000" height="3575"  alt  sizes="(min-width: 720px) 720px"></div>
<div class="kg-gallery-image"><img src="/assets/images/Screen-Shot-2023-01-22-at-10.39.22.png" width="2000" height="2861"  alt  sizes="(min-width: 720px) 720px"></div>
</div>
</div>
<figcaption>Narro's main web interface</figcaption></figure><figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container"><div class="kg-gallery-row">
<div class="kg-gallery-image"><img src="/assets/images/Screenshot-2022-12-26-at-1.33.54-PM.png" width="2000" height="1465"  alt  sizes="(min-width: 720px) 720px"></div>
<div class="kg-gallery-image"><img src="/assets/images/Screen-Shot-2023-01-22-at-10.38.24.png" width="2000" height="945"  alt  sizes="(min-width: 720px) 720px"></div>
<div class="kg-gallery-image"><img src="/assets/images/Screenshot-2023-01-22-at-10.44.25-AM.png" width="1316" height="1666"  alt  sizes="(min-width: 720px) 720px"></div>
</div></div>
<figcaption>Narro developer documentation and status pages</figcaption></figure>
