---
layout: Post
date: '2025-08-11 13:02:15 +0000'
title: UI vs. API. vs. UAI
toc: true
image: "/assets/images/0d522991-da20-408a-9433-2e956c3b814f.jpeg"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115010650254233029
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lw4zoqyzkc2k
tags:
- interfaces
- llm
---


![Vending machine](/assets/images/0d522991-da20-408a-9433-2e956c3b814f.jpeg)

First we built a **user interface (UI)** when the application was just going to be operated by humans. There's a whole branch of study around good and bad patterns in that design practice, focusing on how we make things easily operable by humans.

Then we added an **application programmable interface (API)** when we wanted the application to be operated by other applications - integrated programs. Similarly, there are whole conferences and books about what good design looks like for these interfaces, aimed at how we make programs easily operable by other applications (and developers of those applications).

These past few months I think we're seeing **user agent interface (UAI)** design emerge from all the discussions and usage of agents (LLM and otherwise) to perform actions on behalf of a human. I think we're learning the good patterns in this new area (e.g. [feedforward, tolerance, feedback](https://www.joshbeckman.org/blog/practicing/feedforward-tolerance-feedback-improving-interfaces-for-llm-agents)), around how we make programs easily operable by reasoning agents attempting to execute a human desire.

Mostly I've just been stressing to my team that we need to consider these interfaces for our application as equal surfaces for how our application will be used. As we build features, we need to make conscious decisions about whether and how those features are accessible and legible in all three of those interfaces. And we need to ensure that adding anything to our underlying domain model and application logic doesn't _degrade_ one of those interfaces unintentionally.

And we need to ensure that the source of truth for how a feature functions - if the feature is available in more than one of those interfaces - is abstracted into the underlying application rather than held in any one interface. The key is distinguishing between true business logic (which should be centralized) and interface-specific presentation or interaction patterns (which might legitimately differ).

For example: Let's say we want to add a reservation date field for our reservation system, but it doesn't allow weekends. We shouldn't build a new date picker that blocks weekend dates in the UI if we also want that affordance to be available to an LLM agent (or sibling application using the API). If we want our feature to be available and consistent in multiple interfaces, we should build the "available dates" definition in the lower application logic and then expose it through affordances (e.g. configuration, definition, and schema) in the interfaces above it. Then, the UI and the UAI can both read that definition and manifest it however is best for that specific interface.
