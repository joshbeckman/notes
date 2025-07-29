---
layout: Post
date: 2024-07-04 00:00:00.000000000 +00:00
title: Using an LLM and RAG to Wring Insights From My Posts
toc: true
image: "/assets/images/1ee188b4-30f7-4a14-a60a-3f11905a8058.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/112732310405920997
tags:
- llm
- personal-blog
- code-snippets
- popular
serial_number: 2024.BLG.062
---
<img width="554" alt="Screenshot 2024-07-04 at 15 40 39" src="/assets/images/1ee188b4-30f7-4a14-a60a-3f11905a8058.png">

I've been using large language models - [LLMs](https://www.joshbeckman.org/tags/#llm) - and [retrieval-augmented generation](https://www.joshbeckman.org/search/?q=rag) - RAG - at [work](https://www.shopify.com) for over a year now. I use it to write code, to refine my ideas and writing, and we have been building products on top of it.

It's long overdue for me to be using it for my personal projects. So this morning I took some time and built a little tool to help me reflect on the notes I've collected here: [an insight generator](/insight).

Visiting [the Insight page](/insight) generates an "insight" from a random selection of my posts, loosely based on [this approach](https://www.joshbeckman.org/notes/741185037) to [retrieval-augmented generation](https://www.joshbeckman.org/search/?q=rag).

## How it works

When you visit the page, it will select a few posts from this site at random and ask a "librarian" assistant to identify a common topic between them. Here's the librarian prompt:

> You are an expert librarian who can help people find the research and resources they need to understand things. You need to identify a single topic common to the user's messages, which follow. Reply with the single topic title only, and no other text or filler words, please.

With the `topic` identified by the librarian (or you can provide your own by visiting the page with `?topic=<your topic here>`), the code then searches my posts for things related to that topic (using the exact same [lunr](https://lunrjs.com/) search logic that powers [the search page](https://www.joshbeckman.org/search/)).

Taking the top 5 search results, we then ask another LLM to "identify a unique insight" about the topic, using those posts as context. Here's the prompt I'm using for that:

> You are the philosophical academic Richard Feynman. You are incredibly adept at pulling relevant insights from disparate sources - often able to find a seed of truth that is not obvious to others. Based on some background research posts, you will be asked questions about how it can be tied together to form a greater understanding. Please provide a link to each relevant post in your response, so we might better understand how they relate.

The script then passes the content of the relevant posts and asks:

> What is something insightful about "${topic}", based on those posts?

I might change this in the future. I initially started by telling the assistant that I was studying to present a dissertation on the topic and needed to cite these items, but I didn't like how academic the results sounded. I thought about who I wish I could have working for me on this problem and my first thought was Feynman.

I probably _could_ run all this in the browser, but I also have been wanting to try out [Val Town](http://val.town), so I have been running it there. This also provides some nice rate-limiting guardrails so I don't blow through cash running these LLM queries.

Right now this is using [OpenAI's GPT-4o](https://openai.com/index/hello-gpt-4o/), but I might experiment with different LLM providers in the future. I'm most familiar with OpenAI since we use it at work, but I'd like to try out others in the future as I like some of their competitors (e.g. Anthropic).

## Results

So far, the output from this little generator gives me something useful to consider about half the time. I already use [Readwise](https://readwise.io/i/josh6644) to review my notes every morning, but that focuses on improving recall. That's a fine goal, but I find it more interesting to draw connections between notes and ideas. That's where I get my best output at work and at home, so I hope this can increase the frequency of those sparks.

Let me know if it brings you some insight!
