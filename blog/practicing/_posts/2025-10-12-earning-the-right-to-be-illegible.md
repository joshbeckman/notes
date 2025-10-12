---
layout: Post
date: '2025-10-12 14:41:06 +0000'
title: Earning the Right to Be Illegible
toc: true
image: "/assets/images/d09a6887-eafc-4037-ab7f-0ee489b7cee4.jpeg"
description:
mastodon_social_status_url: false
bluesky_status_url: false
tags:
- management
- software-engineering
- communication
- leadership
serial_number: 2025.BLG.165
---
![Writing on a desk in the yard](/assets/images/d09a6887-eafc-4037-ab7f-0ee489b7cee4.jpeg)

[Seeing like a software company](https://www.seangoedecke.com/seeing-like-a-software-company/) is the best writing about large-company software engineering I've read in quite a while.[^1]

In it, Goedecke maps the concepts of *[Seeing Like A State](https://en.wikipedia.org/wiki/Seeing_Like_a_State)* into a corporate atmosphere:

> 1. Modern organizations exert control by maximising “legibility”: by altering the system so that all parts of it can be measured, reported on, and so on.
> 2. However, these organizations are dependent on a huge amount of “illegible” work: work that cannot be tracked or planned for, but is nonetheless essential.
> 3. Increasing legibility thus often actually lowers efficiency - but the other benefits are high enough that organizations are typically willing to do so regardless.
>
> By “legible”, I mean work that is predictable, well-estimated, has a paper trail, and doesn’t depend on any contingent factors (like the availability of specific people). Quarterly planning, OKRs, and Jira all exist to make work legible. Illegible work is everything else [...]

And I tend to think the need for legibility is _essentially_ a [need for internal control](https://news.ycombinator.com/item?id=45510656). It is a known fact that many people in the organization cannot be trusted - this is why the rules of legibility exist. The paradox is that the engineers who complain most loudly about Jira and planning ceremonies are often the ones with the _least_ illegibility budget. They haven't earned the right to skip the process by first proving they can execute within it flawlessly.

> [!TIP]
> If you are interested in this type of organizational-/systems-thinking, I *highly* recommend [reading Systemantics - The Systems Bible](https://www.joshbeckman.org/blog/reading/after-re-reading-the-systems-bible).

And Goedecke even has [some tips on how to break those legibility rules](https://www.seangoedecke.com/breaking-rules/). But I think it's important to understand how you, as an engineer in that system, can _earn_ illegibility and how you should think about using that to your advantage.

I think you should always know the degree of illegibility that you are _consciously allowed_ by your lead/organization and I think you should approach it like tending a fire or refilling a battery. You should be earning and spending your illegibility budget strategically.

The more senior[^2] you get, the more illegible work you're allowed/encouraged to do.

That's because you are trusted much more by the organization as you gain a larger scope / get more senior. That's essentially what a more senior role entails: trusting you to have wider effects with less oversight.

You earn trust by being legible and executing on things well. [Shopify's trust battery metaphor](https://fs.blog/knowledge-project-podcast/tobi-lutke/#:~:text=Trust%20battery%20fits,each%20other%20feedback.) applies here. You earn the right to be illegible by proving that you can be highly legible when necessary.

You also gain that trust by demonstrating that you _can_ make illegible things legible, on demand or at your own will. You can do this by:
1. taking an illegible problem (a vague product request, a very high-level problem) and
2. doing the research and reasoning and legwork to actually define the problem and
3. finding a solution and then
4. _communicating that widely and clearly_ to the rest of the organization

For example: taking "users are frustrated by the latency of the app" and transforming it into "reducing p95 latency of these key operations by 2s by connection pooling and an API change."

Or this could happen when your VP asks why you've been heads-down for the last week and you are able to legibly explain it _and they agree_ with what you've been doing. If you demonstrate repeatedly that your illegibility is not a risk, but a speedup and asset, they will give you illegibility budget.

You need to ebb and flow into and out of legibility to get things done in any given month. Being successful as a senior lead is often about having great taste for when you should dip into illegibility reserves to move quickly and experiment and when you should resurface to distribute ideas legibly (building trust with those above your) and when you should embed yourself into the general teams' legible processes temporarily (building trust with those below you). Spending too much time in illegible work will cause managers above you to question your direction, and never dipping into the wider legibility processes will cause engineers below you to discount your direction because you're not playing fair.

Leadership is partly about legibly conveying your illegible findings/hunches. This is where I find the most value in being a senior crafter engineer: developing your taste and leaning on it to move quickly - illegibly - and then packing up your work into highly legible projects or features or strategy for the rest of the organization. Just don't forget to recharge that battery after you've spent it.

[^1]: I really resonate with all of it *except* the "Sociopaths, clueless, and losers" section, which I very much disagree with and would remove. I do not endorse that section.
[^2]: I'm going to kinda use the terms "more senior" and "higher career level" and "higher scope" interchangeably here. I don't *like* the term "senior" because of the tenure connotation, but it conveys the career ladder level concept succinctly.
