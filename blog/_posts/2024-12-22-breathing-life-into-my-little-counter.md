---
layout: Post
date: 2024-12-22 16:01:29 +0000
title: "Hacking Life into My Little Counter"
image: /assets/images/47E8A68F0D414D79AF690B9B473DF9AD.jpeg
description: And interactive art piece, counting care
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113697670105981335
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3ldvx4h7cwg2i
tags: 
  - shopify
  - hacking
  - machines
  - folk-creations
  - workspaces
---

I always have fun bringing the digital into the physical world\. Things that you can touch and hear give tactile joy \- bonus points if there’s no/low\-power display\. So someone at work posted that [the Shopify Counter](https://shopify.supply/products/shopify-counter) was available for something like 10% of [the manufacturer’s list price](https://www.smiirl.com/en/counter/category/social#buyit), I jumped at the chance to pick one up and hack something together\. By default, the counter guides you to configure sales/orders to display, but we can have more fun than that\.

![counter](/assets/images/47E8A68F0D414D79AF690B9B473DF9AD.jpeg)

The API is beautifully simple: you just need to provide an HTTP endpoint that will return a number\. The counter is connected to Wifi and pings the Smiirl servers every few seconds, which will just proxy the request to your own server\. I’m using [val\.town](https://www.val.town)  to run mine \(increasingly finding that service invaluable\) \- took me all of one minute to build it\.

The sound the display makes when changing numbers is very satisfying \(and jarringly loud\)\.

<iframe width="100%" height="340" src="https://www.youtube-nocookie.com/embed/Y7r_7uVf3wE?si=iPalpMxBaV4KVpEk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

I wanted this to be something that others could enjoy\. I wanted this to update often \(a counter that never changes is no fun\)\. And I wanted it to be artistically engaging as well\. So, [[here’s what I built::highlight]]: [we choose whether this counter grows or dies](https://www.joshbeckman.org/counter)\.

When you visit that page, you have the option to increase the counter \- help it grow, care for it, nurture it, as a community \- or you can *kill* the counter \- for ​*everyone*​\. Whatever people do on that page updates my counter at home within a second or two\. We’ll see how it goes\! We’ll see how generous or murderous people are\.

But I didn’t want my art piece to have the Shopify logo on it. I figured I could put an NFC tag on it or a QR code somewhere to let visitors to the physical space interact with it (I ended up doing both). But cracking the thing open was really really hard. The closest attempt I found online is [this video of a guy who melts the back panel](https://www.youtube.com/watch?v=cnVvubFi_z0) to get it open - yuck. But I finally figured out that you can pop off the entire front casing by slowly working your way around and lifting the plastic snaps/latches:

<iframe width="100%" height="340" src="https://www.youtube-nocookie.com/embed/aBfWy55h0fY?si=eaExP80NTDaBjNLs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

From there it was a simple insert of the QR code on cardstock and then carefully snapping it all back together\. It’s been working flawlessly for all of 24 hours now\.

And I found a place for this giant display to sit on my tool wall\. It’ll live in the background of my video calls and I hope people find it fun to play with while we’re chatting \- in\-person or online\.

[Grow the counter](https://www.joshbeckman.org/counter).

<iframe width="100%" height="340" src="https://www.youtube-nocookie.com/embed/PmAHgwvY5Xc?si=xOtYpmBrY0RbXFqG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Future

We’ll see how this goes \- I may grow bored if it never changes\. Other ideas I had that I may build this into in the future:
- Make two physical buttons \(grow and kill\) and put them in our home for people to play with
- Call the Strava API to total my distance run or something like that
- Count down the seconds to some future date
- Display the minutes since my birth or something related to my age
- Assign numbers to a set of messages \(e\.g\. “it’s going to snow” or “a package was delivered”\) and display messages\-as\-numbers

Send me your ideas! I’d love to hear them.
