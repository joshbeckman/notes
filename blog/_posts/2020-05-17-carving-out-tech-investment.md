---
toc: true
title: Carving Tech Investment Out of Tech Debt
date: '2020-05-17 00:00:00'
tags:
- software-engineering
- maintenance
- officeluv
redirect_from:
- "/carving-out-tech-investment"
- "/carving-out-tech-investment/"
---

At OfficeLuv, we track our individual tasks into epics, like most other product teams. Also like most others, we’ve had one ongoing group called ‘Tech Debt’ since day 2. Recently, I went grooming through a bunch of the stories in there and decided to break that topic into two separate ideas, one for Tech Debt and one for Tech Investment.

Many people have already expounded on Technical Debt, how to curtail it, and when to accept it. In short, they are the aspects of your product that were built in quick or dirty ways as a trade-off for early usability, while accepting that they will need to be reworked in the future. It’s analogous to debt because it’s a loan you take out to buy a feature or a customer right now, with the understanding that you will pay it back in the future. It can be in the technical domain, in the design domain, or in the product usage domain.

A business tends to view tech debt as an annoyance, an impediment. It’s what the product team spends time on instead of the new feature that will delight the customer. Rightly so, people tend to view tech debt as bad - a necessary evil.

Once you work on a continuous product for a while, I think everyone starts to see an adjacent kind of work crop up - an area I call Technical Investment. Here, I put all the work done to set ourselves up for success in the future. This is work like defining a design styleguide, refactoring our search architecture to support another order of magnitude in our data set. I’m not [the first person to come up with this term and distinction](https://jamison.dance/12-31-2015/technical-debt-and-technical-investment).

But both of these definitions are forward-looking. Tech debt is time we borrow now to give back in the future. Tech investment is time we spend now to have in the future. I find that when you sit down to plan out the day-to-day work, you’re often dealing with the past. And in that light, everything can seem like tech debt, from the outside.

> Why can’t we build this new feature right away? We need refactor this are of the system. Oh, that’s tech debt! _Maybe_.

I think too many product teams identify too much of their work as tech debt. If you have an architecture that was designed to service a catalog of 10,000 products (your maximum projected size at that time) and now must be amended to service two more orders of magnitude, I don’t think that’s tech debt. The work required to bring that architecture in line with your new requirements should be tech investment towards that new goal.

When you have work at hand to refactor a product area, think about whether the current requirements were expected at the time you built it. If they were, this is tech debt - work you decided in the past to do now. If the requirements are in a new direction, this is tech investment you’re spending now to go in that new direction. This is the backward-looking distinction between tech debt and tech investment.

Re-orienting the categorization of our refactors and re-architecture into the dual ideas of tech debt and tech investment has helped improve the perception of this necessary work. People understand that the time we spend on tech investment now isn’t a fault or decision we made in the past - it’s what we spend to open up the future.

