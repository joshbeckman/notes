---
layout: Post
date: 2024-03-14 16:09:22.000000000 +00:00
title: What we talk about when we talk about tech debt
toc: true
tags:
- software-engineering
- popular
serial_number: 2024.BLG.033
---
Recently, I've been talking with people about what we should identify as "tech debt"\.

When we talk about "tech debt", we are talking about: "an undesirable technical environment to build the software we want, leading to undesirable implementations\." That's the definition that resonates with me\.

I see tech debt when I have to compromise on what I *want* to build to get *something* built\. I see tech debt when the product dips in **quality** \(we have incidents because the code is buggy due to overloading logic/etc\.\) or increases in **cost** \(we're wasting money on compute because of inefficient code/structure, or it takes too long to ship something because the code is cumbersome\) or decreased **happiness** \(because people have to fight the code or they have to waste time manually testing because they don't trust it or etc\.\)\. Code can either be in a state in which it's amenable to change \(healthy\) or precariously held together such that change causes problems \(debt\)\.

When I say "environment" here, I mean the code, the infrastructure, the tools, the tests, the dependencies, the data, the security, the monitoring, the observability, the deployment, etc\. I mean the entire technical stack we use to operate the software \- which is pretty general\. But we can be specific about the type of debt we're talking about\.

## Types
There are types of tech debt\. There's **prospective** tech debt: when we build something \(change the software\), we might make a deliberate decision to favor speed or immediate\-ease and sacrifice future ergonomics\. This is where we know we are creating a worse environment in the future, but we're willing to pay that price \(pay down that debt\) in the future\.

And there's **retrospective** tech debt: we look back at what we built previously and realize now that it is hindering us\. We thought, back then, that we were making the right decision but we see that, with what we want the software to do now, we did not and things are now harder than they need to be\.

\([Martin Fowler calls these types ](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)[*deliberate*](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)[ and ](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)[​*inadvertent*​](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)\. It's pretty similar thinking, I just like these terms better\.\)

There will always be tech debt, as long as the software 1 is being changed\. The prospective tech debt can be avoided \(if we desire; we don't usually desire this and we make calculated tradeoffs\) but retrospective tech debt cannot always be prevented\. We didn't know then what we know now, and requirements of the software change\. It's ok\.

Our job, as developers, is to identify both types\. Avoid as much as we can and manage paying back the rest\.

## Avoidance and Management

There are ways of avoiding tech debt\. One way that developers often fall into making retrospective tech debt is they jump into implementing the easy thing \- whatever fits the current environment\. We can avoid this trap by: understanding the problem we need to solve as well as possible, then designing our ideal solution outside of the environment, then seeing how the solution fits in the current environment\. If it doesn't fit, consider: how would we modify our solution so that it does fit? Is it better now? If not, how should we change the environment to solve our current problem and retain the software's previously desired behaviors? This prevents us from jumping to the initial implementation and [soothing our ego with implementation over solution](https://www.joshbeckman.org/notes/510115333)\. Most of senior leadership is guiding this exploratory and explanatory loop\.

Once we've identified some tech debt, it's our job to manage paying it back\. There are innumerable instances I see every day \- little paper cuts in how we have to navigate and manipulate the code\. We can't just point to each one and complain, though\. We have to assemble them into packaged ideas: actionable payment plans on tech debt include a clear statement of the problem \(its negative effects, its boundaries\), a generalized set of principles that guide the team on how to resolve it, and an action plan with steps to resolve it \([a good strategy](https://www.joshbeckman.org/notes/475620660)\)\.

## Opportunities

So what should you do when you see tech debt? You might see if through the windshield, or in the rearview mirror\.

Maybe you're a senior crafter who can see prospective tech debt in a decision in progress\. Surface it\! Make it visible \- in a way that is *understandable* to the people who can help you pay it down\. Use your influence to guide the team to a better decision, or, if the team decides to take on the debt, make sure it's recorded \(likely as a GitHub issue\)\. Recording it makes it visible and actionable, and, most importantly, allows you and others to accumulate \(via comments, links, etc\.\) examples of its impact and the information necessary to pay it down later\.

Maybe you're a junior crafter, deep in the code, and you see a pattern that is preventing you from making the change you want to make in the way you want to make it\. Surface it\! Make it visible \- in a way that is *understandable* to your team leads\. They can help you understand the problem and guide you to a solution, and your description of the problem can help them understand the impact and the information necessary to prioritize it\.

How have you made tech debt visible recently?
