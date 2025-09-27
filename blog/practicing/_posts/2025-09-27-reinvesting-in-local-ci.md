---
layout: Post
date: '2025-09-27 16:27:34 +0000'
title: Re-Investing in Local CI
toc: true
image: "/assets/images/289ad3e9-b5f4-4225-b130-12353c24b777.jpeg"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115277469899556985
bluesky_status_url: false
tags:
- tests
- software-engineering
- shopify
serial_number: 2025.BLG.160
---
I read [this great post by Brandur](https://brandur.org/nanoglyphs/043-rails-world-2025) over the weekend and got inspired. Specifically, the sketch of a world where continuous integration (CI) for your software is local and takes less than 2min to run!

> 70 seconds test times for a large real world app. That’s better than Google, better than Apple, better than Dropbox, better than Netflix, and better than Stripe, likely by 10-100x. A test suite that fast keeps developers happy and productivity high. And all in Ruby! One of the world’s slowest programming languages.

Inspired by this, I spent some time this week on my teams' test suites and got them to be 70% faster in local execution, with a fraction of the noisy log output, with multiple shorthand commands for running "local CI" by the user themselves or by AI agents/editors. This means a much tighter and more accurate feedback loop for their local development (they are instructed to run local CI on all changes before proposing them, running it hundreds of times an hour). 

Largely, I did this by:
- parallelizing tests (we have MacBooks with 11 CPU cores!)
- intelligent test selection (instead of all-or-nothing approaches)
- log hygiene (instead of tolerating noise)
- making affordances (easier handholds and documented practices get used much much more)

![Caldwell Lily Pool in Chicago](/assets/images/289ad3e9-b5f4-4225-b130-12353c24b777.jpeg)

Before my changes, developers would write some code, maybe run some listing or type-checking locally, then push their changes into a pull-request to let cloud CI tell them if it was fully correct. That's nice and holistic, but makes the feedback loop take minutes (to hours, if the CI pipelines and worker fleets are backlogged). There's always a tension here between speed and thoroughness. [As in](https://www.joshbeckman.org/notes/563106559), faster unit tests can suffer from Goodhart's Law - optimizing for speed over actual correctness. But I believe we can have both: fast local feedback for the majority of cases, with comprehensive cloud CI as the final arbiter.

In the current world, I'm working on 5 branches (git worktrees) concurrently and 4 of them are running AI agents in a loop, feeding on their own feedback and pinging me for guidance. I/they need much faster and more accurate [feedback](https://www.joshbeckman.org/blog/practicing/feedforward-tolerance-feedback-improving-interfaces-for-llm-agents) loops to test ideas and be more confident in making changes. I want to get to a place where local CI takes a minute or two and is 99% accurate to what cloud CI will tell you, with one bash command.

Brandur describes why it's hard to maintain local development feedback loops in large codebases:

> Broadly, there are three stages in the long arc of a company’s CI trajectory:
> 1. Early on, the test suite is run only locally.
> 2. CI is set up. Test suite is runnable both locally or in CI.
> 3. Test suite gets too big, or too custom, or has too many dependencies. Test suite is runnable only in CI.

> After the transition to stage 3 there’s a brief moment where things are still theoretically recoverable, like if a small team of dedicated engineers worked day and night for a few weeks they could walk things back from the brink, maybe. But generally speaking, you’re caught in the gravity well. After crossing the event horizon, there’s no going back. The overwhelming default will be to descend further into the black hole. The build continues to get more custom and requires more configuration and leverages more cloud constructs. There’s ~0 performance feedback now, so engineers don’t even notice half the time when they write slow tests, further degrading the morass. [...] A test suite that can still run on one machine can be shaped and sped up. Once you’re cloud only, all bets are off.

I'm not as pessimistic as Brandur here; I think we can measure performance of testing even in a cloud CI environment, and deliver that feedback (with incentives) to the responsible teams to get them to improve tests. This is slowly happening on my teams. _But_ I do agree that local CI has _all_ the incentive alignment and feedback provided to the end user such that they are much more likely to fix things. Now, I'm running loops faster and [cleaning the streets so that others feel encouraged to do so](https://www.joshbeckman.org/notes/535683127).

Also, the day after I made the big testing speed-ups, there was a cloud CI outage that halted most teams' feedback loops - but not mine.
