---
title: Principles of Good Systems &#x2B22;
tags: system-design scalability observability safety
author: Josh Beckman
---

These are qualities of a good system that we should strive to fulfill with what we design. Without fulfilling each of these attributes, the system is much more likely to fail in its goal.

This details here are a work-in-progress.

## Safety

Nothing bad can happen.
[[Access Control Logic, Resource Limits, [interlocks](https://notes.joshbeckman.org/notes/487349097), [jigs/poka-yoke](https://notes.joshbeckman.org/notes/487680878)::rsn]]

## Liveness

Something good happens, eventually.
[[Desired State interfaces, Slack capacity, ([more about safety and liveness](https://en.m.wikipedia.org/wiki/Safety_and_liveness_properties))::rsn]]

## Observability

Activity, configuration, and behavior within the system is legible and actionable by the user.
[[Data used to scale the system is a first-class entity, logs-as-data, ::rsn]]

## Controllability

Users and administrators can cleanly and clearly tune the system to operate within bounds.
[[Feedback mechanisms, tenacy-based limits, progressive disclosure of manual overrides::rsn]]

## Composability

Complex behavior can be created with the system by assembling components. Pieces can be swapped, edited, etc. in isolation (without considering the full state of the system).
[[Desired state and declarative interfaces, Narrow waist protocols, Domain Driven Design::rsn]]

## Scalability

More work can be done by the system by adding resources. The system does no impede its own expansion.
[[Caching layers, horizontal load balancing::rsn]]

---

## Related

Often, people will say that they want to optimize a system for "reliability."
In my experience, this term really is a combination of both _safety_ and _liveness_.
What's reliable?
A system that _does what I want_ (liveness) and _doesn't do the things I don't want_ (safety).
![Untitled-2023-05-18-1052](https://github.com/joshbeckman/notes/assets/2358584/aaf8ec03-e4ee-4e3c-9a11-ecbb7d654911)
