---
title: Armstrong Metric
image: https://avatars.githubusercontent.com/u/1952127
source_emoji: 🌐
mastodon_social_status_url: true
tags:
- metrics
- observability
---

_(noun) /ˈɑːmstrɒŋ ˈmɛtrɪk/_

A metric which is too noisy to be monitored (does not indicate system health), but which nonetheless is helpful is understanding [system](https://www.joshbeckman.org/notes/principles-of-system) behavior.

Named for [Jeff Armstrong](https://github.com/MahlerFive).

Example:

> We can’t set up an alert for transient errors because the number/rate of transient errors is an Armstrong metric - it fluctuates outside of our control and sometimes for desired reasons.
