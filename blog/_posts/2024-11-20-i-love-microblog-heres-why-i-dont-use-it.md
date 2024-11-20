---
layout: Post
date: 2024-11-20 08:01:14 -0600
title: "I Love micro.blog - Here’s Why I Don’t Use It"
toc: true
image: /assets/images/b40df2a3-ce7d-4273-ab07-f9307b74288e.png
description: 
mastodon_social_status_url: false
tags: 
  - personal-blog
  - social-networks
  - publishing
---



I spent last night reactivating my [micro.blog](http://micro.blog/) account and trying to run some imports of my [Jekyll](http://jekyllrb.com/) posts from my main site.
<img width="222" alt="Screenshot 2024-11-20 at 08 02 59" src="/assets/images/b40df2a3-ce7d-4273-ab07-f9307b74288e.png">

I had been seduced again by the amazing simplicity and synergy of micro.blog. I want writing tools that I can use easily on my laptop and on my phone and on the web: check. I want to POSSE ([example](https://www.joshbeckman.org/blog/how-to-crosspost-to-mastodon-with-jekyll)) my writing and photos to all the non-blog social networks (while they’re here now, but not be tied to them as a source of truth when they inevitably wither away again): check. I want to have newsletter support for people who like that subscription medium: check. I want to spend time on my site but not all my time on my site - someone else can handle DDOS attacks: check ([Manton](http://manton.org/) is a fantastic example of a dedicated operator).

If you don't already run your own site *or* if you do and it's *not complicated*, stop here and go make a micro.blog account. Use that for writing and interacting online. Don't start down my path.

Here are the things that make me hesitate: I really love customizing my site with special pages, special features, etc. I think micro.blog will support that (it uses [Hugo](https://gohugo.io/) themes and plugins, so I guess it’s fully extensible that way?), but I haven’t tried. Maybe I just need to try. I really love the ability to rebuild all the metadata/content of my site with my own scripts - and I use that metadata a lot in my site designs. Technically micro.blog supports this but you have to interact through its HTTP API instead of modifying static files. I would want to have scripts that post things on my behalf (mainly my [Readwise](http://readwise.io/) notes/highlights). I’m pretty sure I could wire this up with micro.blog’s API, but it would be more complicated than it currently is written. I love the backlinks support that I’ve built into this site. I could probably(?) write a plugin to replicate that in micro.blog, but it would be some work.

Honestly, I love puzzling out how to do build the integrations myself. I just got caught up thinking about how I could write a script to pull in anything I might post on Bluesky or Mastodon.social and import it as a post on my proper site (so that I could author simple posts/notes in their dedicated apps, and so that I could reply to people’s posts/skeets/toots in those mediums and then display them on my own site). I love the Readwise importing system I have built. I love organizing things the way I want to shuffle them around - and shuffle them easily.

I was thinking as I was falling asleep last night (hubristically): I should hold on to this implementation of federation and blog-building that I’ve created. Maybe it’s not as perfectly packaged for other people as micro.blog has become, but it’s [my own home-cooked meal](https://www.robinsloan.com/notes/home-cooked-app/) and maybe it can serve as an example for people when they look at the consolidated online writing space. I have been so happy to see options beyond Twitter and WordPress flourish in these last few years, and maybe I should continue to water this flower I’ve planted in that garden.
