---
layout: Post
date: 2024-12-17 13:52:53 +0000
title: "Planning A Spaced Repetition System for My Site"
toc: true
image: /assets/images/1ABAE25016594772B3E5338BD71105E6.jpeg
description: 
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113669683170861908
bluesky_status_url: false
tags: 
  - personal-blog
  - memory
  - note-taking
---

I think I can build a spaced repetition system on my own site that can replace the one I use on [Readwise](http://readwise.io) right now\. It’s not that I dislike the Readwise tooling, it’s that it doesn’t include *all* of my writing/notes \(e\.g\. blog posts\) and the highlights in Readwise don’t have all the context that I’ve built around them on this site \(e\.g\. backlinks, source linking, [LLM\-aided insights](https://www.joshbeckman.org/blog/using-an-llmand-rag-to-wring-insights-from-my-posts)\)\. 

I think I can build a little val in [val\.town](http://val.town) that can use a simple spaced\-repetition\-algorithm \(SRS\) JavaScript library to calculate which posts to show\. I can use the sqlite storage in val\.town to hold simple rows of each post along with the data required to run the SRS: post URL, timestamps, review state\. The script can pull in the list of posts from this site’s search data file \(as it does for running the LLM insights currently\)\. It can provide a simple API of: paginated posts to review, update post review state\. 

On the site, I would make a dedicated page to start a review\. But that page would simply start the journey \(e\.g\. by setting a session storage state in the browser or setting some variable in URL query params\) and then navigate me into the page of the first note to review\. That way, I can fully engage with the note on the normal page and use all the tooling there\. In the “review” mode, some additional buttons/interface can show up on the page \(e\.g\. update the review state of the note\)\.

Then I can just review until I run out of interest/time\. And come back to restart whenever I want\. 

To prevent other people from reviewing on my behalf \(this is a public site, after all\), I could have the start page ask for a username/password to unlock the review system\. That could be verified by the val\.town script and then stored on the client session storage for each subsequent request\. That way, no one is able to make a successful review/update without the password\. And I can rely on val\.town’s already\-enforced request rate limit to prevent brute\-force attacks\.

![forest image](/assets/images/1ABAE25016594772B3E5338BD71105E6.jpeg)

I didn't have time to build it this morning so I wrote this instead\.

