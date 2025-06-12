---
toc: true
title: Scaling Queue Workers Efficiently with AppSignal Metrics
date: '2020-07-11 00:00:00'
tags:
- queues
- officeluv
redirect_from:
- "/scaling-queue-workers-efficiently-with-appsignal-metrics"
- "/scaling-queue-workers-efficiently-with-appsignal-metrics/"
---

AppSignal asked me to write for their blog. My first post is about some techniques we’ve been using at OfficeLuv to responsively scale our queueing systems based on usage. From the introduction:

> Most web apps can benefit from a background queue, often used to process error-prone or time-consuming side jobs. These background jobs can vary from sending emails, to updating caches, to performing core business logic.

> As any background queueing system scales the number of jobs it needs to process, the pool of workers processing those jobs needs to scale as well. In cases where the rate of jobs being enqueued varies, scaling the number of queue workers up becomes a key aspect in maintaining processing speed. Additionally, scaling down workers during low queue throughput can provide significant savings!

> Unfortunately, many queueing backends don’t come equipped with scaling logic to turn workers on or off. But we can use some simple math and performance data to find our optimal worker count based on the work waiting in the queue.

[Read the rest on AppSignal’s blog »](https://blog.appsignal.com/2020/07/08/scaling-queue-workers-efficiently-with-appsignal-metrics.html)

