---
title: Principles of Good Systems &#x2B22;
tags: systems, scaling, observability, safety
---

These are qualities of a good system that we should strive to fulfill with what we design. Without fulfilling each of these attributes, the system is much more likely to fail in its goal.

This details here are a work-in-progress.

## Safety

Nothing bad can happen.
[[Access Control Logic, Resource Limits::rsn]]

## Liveness

Something good happens, eventually.
[[Desired State interfaces, Slack capacity::rsn]]

## Observability

Activity, configuration, and behavior within the system is legible and actionable by the user.
[[Data used to scale the system is a first-class entity::rsn]]

## Controllability

Users and administrators can cleanly and clearly tune the system to operate within bounds.
[[Feedback mechanisms, tenacy-based limits::rsn]]

## Composability

Complex behavior can be created with the system by assembling components. Pieces can be swapped, edited, etc. in isolation (without considering the full state of the system).
[[Declarative interfaces, Narrow waist protocols, Domain Driven Design::rsn]]

## Scalability

More work can be done by the system by adding resources. The system does no impede its own expansion.
[[Caching layers, horizontal load balancing::rsn]]
