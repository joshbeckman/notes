---
toc: true
title: Hard Numbers Calculator
date: '2015-06-08 00:00:00'
redirect_from:
- "/hard-numbers-calculator"
- "/hard-numbers-calculator/"
tags:
- threadmeup
- venture-capital
---

When you’re leading a team of developers for a startup company, you often get asked to define hard numbers. You get asked questions like:

> How much money would it take you to build the ideal solution?

> How much would it cost to build an MVP - a hard estimate?

> What if you hired twice as many people - how long would it then take?

I find those _difficult_ to answer. I thought I could make a calculator to answer for me: [the Hard Numbers calculator](https://ghpages.joshbeckman.org/hard-numbers). Given an input of one-person development time and salary, it will calculate estimates of time and cost for a given project.

### Behind the curtains

It takes into account things like salary and a basic one-person development time. It also hides some complexity like organizational debt and acquisition cost. What that means is that it factors in the time and some cost required to hire a team of new people. It also will not just let you “throw bodies” at the project; adding 50 people to a project that would take one person a month will not reduce it to less than a day.

Play around and let me know what you think or would change.

