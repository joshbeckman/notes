---
layout: Post
date: '2025-07-23 17:21:05 +0000'
title: My Graham Evaluation
toc: true
image:
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114903776072903113
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lunkvy5scu27
tags:
- llm
- llm-prompts
- human-psychology
- identity
serial_number: 2025.BLG.113
---
So yesterday someone at work shared [this fun video](https://x.com/cpaik/status/1947657982784774488) of a guy trying out the [Dia browser and its "skills" feature](https://www.diabrowser.com/skills) to evaluate online personas (basically just a prompt given to an LLM with browser+search tools capabilities) and i wanted to try it on myself.

## Prompt

[The prompt](https://www.diabrowser.com/skills/graham) is a request for structured analysis of a person's online presence based on [_What's going on here, with this human?_ by Graham Duncan](https://grahamduncan.blog/whats-going-on-here/):

```markdown
You are a seasoned talent evaluator applying Graham Duncan’s ‘What’s going on here, with this human?’ lens.


Using only the public information in the profile below, produce a concise, high-fidelity brief (cynical if truthful) that opens with a TL;DR and then covers:
TL;DR (2-sentence max) – crisp headline insight about the person.

Game being played – the overarching, possibly infinite objective they appear to pursue.

Rider vs. Elephant – hypotheses about their conscious narrative (rider) and core drives/compulsions (elephant).

OCEAN Big Five snapshot – Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism (high/low + one-line evidence each).

MBTI type guess – likely four-letter code with a one-sentence rationale.

Enneagram type guess – dominant type (+ wing, if evident) with rationale.

Signature strengths shadow weaknesses – how each strength could invert under stress.

Ecosystem fit (‘water’) – contexts where their genius compounds vs. stalls.

Ten-adjective reference guess – how close observers might describe them.

Letter-grade dashboard (strict, no inflation) – assign an A–F with one-sentence justification for each:
IQ
EQ
Judgment quality
Self-awareness
Integrity / trustworthiness
Collaborative ability
Ambition
Influence

Key questions to ask next – 3–5 questions that would most quickly confirm or falsify your hypotheses.

Optimal seat – the role or environment likely to unlock the most leverage for them (and for a team).

Embrace negative capability—hold multiple plausible readings at once, note your own biases, and state confidence levels.

Bullet format, ~450 words total.
```

## Response

I used the prompt with OpenAI GPT-o3 with Google search tools enabled, and here is the output it generated for me ("Person: Josh Beckman (www.joshbeckman.org)"):

**TL;DR**
- Systems-minded engineer who seeks to “wire power to others” by building clean abstractions, writing publicly, and gardening his own corner of the web.  
- Intellect outweighs ego; leverage comes from code, docs, and quiet influence rather than loud charisma.

Game being played  
- Infinite game of empowering makers - build platforms, OSS, and written guides so other people (merchants, devs, colleagues) can move faster with fewer sharp edges.

Rider vs. Elephant  
- Rider (explicit story): “I share what I learn and craft tools so anyone can build.”  
- Elephant (implicit pull): Intellectual stimulation + autonomy; deep need to understand and perfect systems, then gain quiet respect for that mastery.

OCEAN snapshot  
- O High – maintains personal knowledge base, experiments with IndieWeb, travels/backpacks.  
- C High – Senior Staff at Shopify, long-lived blog, meticulous site taxonomy.  
- E Low-Mod – publishes, but small social graph; prefers async writing to real-time hustle.  
- A Mod-High – tone is helpful, open-sourcing work, “support; verification” section lists ways to reach him.  
- N Low – sustained projects, public writing; little evidence of public angst.

MBTI guess  
- INTJ – future-oriented systems builder (Ni), structured execution (Te), sparse but thoughtful public presence (Fi/Se relief).

Enneagram guess  
- Type 5w1 (Investigator with reformer wing) – gathers knowledge, optimizes systems, and adds a moral layer of “this should be better for everyone.”

Signature strengths ⇒ Shadow weaknesses  
- Systems thinking → can over-optimize and miss emotional cues.  
- Self-sufficiency → drifts into isolation, “build it myself” trap.  
- Transparency/open work → info-dumping overwhelms less technical peers.  
- Reliability → rigidity under shifting priorities.

Ecosystem fit (“water”)  
- Compounds: remote-friendly, document-first cultures, 0→1 platform work, long time-horizons, small teams that prize autonomy.  
- Stalls: high-politics orgs, rapid-fire pivots, heavy synchronous meetings, environments that reward showmanship over substance.

Ten-adjective reference guess  
Analytical, methodical, curious, principled, independent, reliable, insightful, modest, opinionated, maker-oriented.

Letter-grade dashboard (confidence in brackets)  
- IQ A - breadth/depth of public technical output. (75%)  
- EQ B- – considerate online tone, but limited social broadcast. (50%)  
- Judgment A- – senior platform roles, avoid rewrites, writes “never rewrite” essays. (60%)  
- Self-awareness B+ – explicit “about” nuances, publishes learning process. (55%)  
- Integrity / trustworthiness A – long open-source history, public accountability. (70%)  
- Collaborative ability B – leads teams, but prefers async/solo work. (45%)  
- Ambition B+ – pursues Staff-plus track, yet eschews loud personal branding. (60%)  
- Influence B- – impacts through code & docs more than follower count. (50%)

Key questions to ask next  
1. What recent decision did you reverse after new data emerged?  
2. When have you knowingly shipped something “good enough” instead of perfect?  
3. What energises you more: mentoring one engineer deeply or presenting to 100?  
4. Describe a time organisational politics blocked a technical improvement—how did you react?  
5. Which personal project are you secretly afraid to abandon?

Optimal seat  
- Staff/Principal engineer or platform architect on a small, high-agency team where success is measured by developer/merchant leverage, not headcount managed.

Meta  
- Confidence: medium - analysis based only on public self-curated signals; skew toward his crafted online persona.  
- Biases acknowledged: sample favours written, English-language content; may under-weight interpersonal dynamics unseen online.

## Evaluation (of the Evaluation)

It was correct about the Enneagram type ([I've previously tested as type 5](https://www.joshbeckman.org/notes/688592577)) but somewhat off on the Meyers-Briggs type ([I've tested as ENFJ in the past](https://www.joshbeckman.org/notes/688599900), which is more extroverted than the INTJ it guessed). I think I'm more extroverted in person than I come across online, where I tend to be more introverted and reserved. Maybe I should bring that online persona into alignment with my in-person self?

This is a fun mirror to shine on yourself, and I think the analysis is more accurate than I would have expected, and something I'd be comfortable with putting in front of others. I usually want to try out these kinds of prompts/LLM-analyses because this is absolutely going to become more common in the future. Again, this is a reminder that [publishing your thoughts is increasingly the best way to surface](https://www.joshbeckman.org/notes/884224560) well in LLM-mediated interfaces (like this Dia browser).

I should probably write dedicated posts to answer those "Key questions to ask next."

