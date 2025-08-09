---
layout: Post
date: '2025-08-09 16:23:42 +0000'
title: 'Feedforward, Tolerance, Feedback: Improving Interfaces for LLM Agents'
toc: true
image: "/assets/images/bc5cfb31-6430-4fa0-8176-f891f86dc8b6.jpeg"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115000018134389281
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lvyclrvl642p
tags:
- AI
- LLM
- safety
- validation
- controllability
- error
- software-engineering
- system-design
- interfaces
serial_number: 2025.BLG.125
---
![Handles](/assets/images/bc5cfb31-6430-4fa0-8176-f891f86dc8b6.jpeg)

My team is building an agent for complex, multi-language artifacts with interdependent parts. We keep coming back to this hierarchy:

1. **Feedforward:** Provide the right context to prevent errors
2. **Tolerance:** Be tolerant of output variations to parse intent  
3. **Feedback:** Give specific, actionable feedback for errors that remain

These are the same design principles [Don Norman articulated decades ago](https://www.joshbeckman.org/blog/reading/after-reading-the-design-of-everyday-things) for physical products and interfaces. They're inherent to good system design, whether you're building a door handle, a nuclear control panel, or an LLM agent.

**The order is everything**. Each principle builds on the previous one, creating a cascade of prevention that dramatically reduces the work needed at each subsequent level.

## Why Feedforward Comes First

Create an environment where correct behavior is inevitable.

Don Norman teaches us that [physical constraints are most effective when they're visible before action is taken](https://www.joshbeckman.org/notes/487346022):
> Physical constraints are made more effective and useful if they are easy to see and interpret, for then the set of actions is restricted before anything has been done.

Feedforward implements [affordances and signifiers](https://www.joshbeckman.org/notes/487338879) - showing what's possible *before* action occurs. Toyota calls this [poka-yoke](https://www.joshbeckman.org/notes/487680878): error-proofing through constraint.

[Conflicting context creates "Context Clash"](https://www.joshbeckman.org/notes/909432226) - LLMs fail trying to reconcile contradictions. Make your [constraints](https://www.joshbeckman.org/notes/487345311) legible upfront. Prevent errors at the source.

### Practical Feedforward Improvements

In our agent, this meant:
- **Better RAG results:** Ensuring retrieved context actually matches the task at hand
- **Consistent formatting:** Making sure examples in prompts match exactly what we expect as output
- **Aligned tool inputs:** Ensuring the description of a tool's inputs matches the examples we provide
- **Clear schemas:** Providing unambiguous structure definitions upfront (even context-free grammars!)
- **Validation context:** Telling the LLM about the validation our system will perform on its output

Example: We embed validation rules in context. Don't wait for the LLM to hit errors: tell it the constraints upfront. This eliminated entire error categories.

## Tolerance: Widening the Target

[Parse, don't validate](https://www.joshbeckman.org/notes/547226905). Transform imperfect input into structured output while preserving intent.

This principle shows up everywhere in good design:
- USB-C cables that work in either orientation
- Search boxes that accept various date formats
- Forms that accept phone numbers with or without dashes

In our LLM context, tolerance looks like:
- If the output is `{{ order.id }}` but the system wanted `order.id`, we strip the liquid syntax
- If we get `"true"` instead of `true`, we parse the string to boolean
- If timestamps come in various formats, we normalize them

Tolerance recognizes clear intent despite imperfect format. Good design accounts for variation.

## Feedback: The Safety Net

Feedback comes last. Make it count.

Following Don Norman's principle of [bridging the Gulf of Execution and Gulf of Evaluation](https://www.joshbeckman.org/notes/487681065):

> On the execution side, provide feedforward information: make the options readily available. On the evaluation side, provide feedback: make the results of each action apparent.

When our agent does hit an error, we ensure:
- **Exact error messages:** Not just "syntax error on input foo.bar[1]" but "syntax error on input foo.bar[1]: value 'my number' must be an integer"
- **Natural response pairing:** Error formats that mirror the input structure
- **Self-healing paths:** Give the LLM enough information to correct itself, though we let it discover its own solutions rather than prescribing fixes

Good feedback enables self-correction.

## The Compound Effect

What makes this system powerful is how each tier reduces load on the next:

1. **Better feedforward** → Fewer errors reach the tolerance layer
2. **Smart tolerance** → Fewer errors need feedback
3. **Clear feedback** → Faster convergence when iteration is needed

Apply these in order and most remaining errors become genuine edge cases.

## The Universal Truth

These aren't just agent interface principles. They're universal design principles for any system with unpredictable agents.

Norman: ["Civilization advances by increasing the number of operations we can perform without thinking"](https://www.joshbeckman.org/notes/487344559). Good design makes correct behavior automatic.

Prevent through feedforward. Parse tolerantly. Feedback precisely.

**Fix the environment, not the errors.**
