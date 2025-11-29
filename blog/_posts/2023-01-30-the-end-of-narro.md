---
toc: true
title: The End of Narro
image: "/assets/images/Screen-Shot-2023-01-22-at-10.54.43-copy.jpg"
description: The timeline and reasoning behind why I shut down Narro, the best way
  to listen to the internet.
date: '2023-01-30 14:01:58'
tags:
- narro
redirect_from:
- "/the-end-of-narro"
- "/the-end-of-narro/"
serial_number: 2023.BLG.005
---
Over the past few months, I have been shutting down [Narro](/narro) (`narro.co`). This week I have been spinning down the last remaining servers, disassembling the final pieces.

I initially published the [announcement on the Narro blog](https://blog.narro.co/post/704215532872876032/notice-narro-shutting-down), but a summary is that the service had become a burden to operate and was no longer profitable enough to sustain itself. Here, I want to expand a bit on why and how I shut down the service and company. I’ve set up a separate, dedicated page to document Narro’s history and features:

> [Narro](/narro) was a service I operated from 2014-2023 and a company I operated from 2016-2023 that turned your reading list or blog into a podcast. It was the best way to listen to the internet. As one user said: “Pretty much the best thing to happen to your morning commute

<img src="/assets/images/apps.png" alt="">

## Increasing Costs

I have operated Narro as a service since 2014 and I have operated the corporate entity since 2016. Every year saw a growth in user base and most of them actually saw a growth in revenue. I have never been a good marketer of Narro and honestly I never put much effort into marketing at all. So any growth in free accounts was purely word of mouth, any growth in paid accounts was purely due to the utility of the service.

In the last few years, however, Narro had significant decline in profit from paid accounts (Narro has always operated a freemium model). Largely, this was due to an increase in base costs needed to operate a high-data service. Costs to _generate_ audio (text-to-speech APIs) had not changed over recent years (though TTS hasn’t gotten any cheaper), but costs to operate Narro’s servers have increased over time and the costs to store the terabytes of audio files (and especially the bandwidth costs to serve the large audio files) progressively ate away at any profits.

I could have changed the pricing model again. I could have charged more to paid accounts to recuperate those increasing data costs. I could have increased restrictions on free tier accounts or eliminated the free tier entirely.

But here we get to the other reason I needed to shut down Narro: I didn’t have the desire or need to build any more of it. Building Narro had been a great intellectual challenge for me - the mental cost of doing the work was nonexistent during the meat of development because I devoured the problems of architecting a highly scalable service. But over the last few years, the work to be done was pure maintenance or pricing model architecture. These were things that were no longer challenging and so working on them was a high cost effort.

Finally, I was hardly using the service any more. In the past, I would transcribe hours of audio into my Narro podcast _every week_. In the last year or so, my outlook on reading had changed and I wanted to spend more time reading articles in their authored source, reading books in my hands, and annotating both mediums much more. I was generating only a handful of Narro readings each month.

## Attempting a Sale

These costs weighed in my mind while I saw Narro still providing great utility to its loyal paying customers and while I still saw great appetite for text-to-speech services in the market. So, at the urging of [a friend](https://ybv.github.io), I prepared the materials and listing to sell Narro’s business into new ownership in August of 2022. I wanted to transfer or halt the business by the end of 2022 so that I could enter 2023 with a clean slate.

I listed it on a couple small-company marketplaces ([MicroAcquire](https://acquire.com) and [Flippa](https://flippa.com)) and started fielding inquiries. It was interesting seeing what offers came to Narro in those marketplaces. I was slightly disheartened but not surprised by the number of requests to sell the payment processing account simply as a vehicle for fraud or requests to sell the customer account information to email marketers or other targeting businesses. (Maybe I’ll write more about this experience in the future.)

Eventually I did get a couple worthwhile offers to acquire and operate the service. I went through the transaction process with one, after an auction period with a few bidders, and began the transfer of funds. Then, the acquirer stopped responding to all contact.

After a few weeks I restarted the sales process. I found a new buyer and started the transfer of funds and assets again. Again, the buyer halted all communication. After a couple weeks, they finally resurfaced (they had experienced some life changes), but these swings and misses had drained my energy and my time. It was now the beginning of December and I decided to aim at closing down operations instead of attempting a sale that had shown to be low-confidence and high-effort.

## Shutdown Timeline

Once I had decided to shut down the service, I contacted a legal advisor through [Lawbite](https://www.lawbite.co.uk) (via Narro’s [Stripe Atlas](https://stripe.com/atlas) membership - [written about at the time]( /on-narro-joining-atlas/)). The attorney assigned to Narro’s case was incredibly helpful and navigated the sluggish and wrinkled process of preparing and filing the dissolution process as well as settling some outstanding fees around the corporation.

I then started communicating the shutdown to Narro users. Effective December 30th, 2022, Narro stopped generating new readings for all accounts. At that time, Narro also stopped any account and subscription charges. All Narro accounts retained access to their readings until January 21st, 2023. At that time, I started turning off Narro services entirely.

<img src="/assets/images/Screenshot-2023-01-22-at-10.40.28-AM.png" class="kg-image" alt="My final reading count on Narro." width="1392" height="280"  sizes="(min-width: 720px) 720px">

## Going Forward

In building Narro, I spun off [several](https://github.com/NarroApp) open source [projects](https://github.com/andjosh/staticus) [and](https://github.com/andjosh/gopod) [libraries](https://github.com/andjosh/translate-emoji). These have now been archived or moved under [my personal GitHub account](https://github.com/andjosh) (where I will maintain them and you can [sponsor their development](https://github.com/sponsors/andjosh)!). In the future, I may extract and publish more useful libraries from Narro’s source code.

Many Narro users reached out asking for alternatives as I shut down the service. Back in 2014, I didn’t know of any other service offering Narro’s features. Today, dozens of other services are available:

- [Play.ht](https://play.ht/) for turning blogs into podcasts
- [Speechify](https://speechify.com) for listening to texts as audio on your devices
- [Audioread](https://audioread.com/) for sending individual reading list articles into a podcast
- [Voicemaker](https://voicemaker.in/) for turning plain text into audio files
- And many others you can find by searching for ‘text to speech ...’ online

As far as my time goes, I plan to turn it back to building small [projects and open-source libraries]( /writing-a-better-readwise-to-day-one-import/) for a while. I haven’t built tiny things in the last few years - I’ve been training myself to think big while at Shopify - and I miss the pleasure of scratching small itches and iterating rapidly on small codebases.

I’ll bet that I start another service or platform in the future, but I don’t see that future date from where I stand today.

**My Thanks**

Thank you if you used Narro, and thank you especially if you appreciated the service enough to pay for it or contact me about it. Some Narro users had been paying since the first year, and I was personally familiar with many of the heaviest users.

Thank you for suggesting improvements, for your patience as I built them, and for your support of a small business and indie web development. As I sent out the communications around shutting Narro down, some users offered to pay 5X their old prices if it meant keeping the service alive, and it warms my heart to know that it was so useful in your life.

I hope to be building more of that in the future, but this chapter has closed. If you want to see what I'm doing: [subscribe]( /subscribe/).

