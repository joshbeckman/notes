---
title: Armstrong Metric
image: https://avatars.githubusercontent.com/u/1952127
source_emoji: "\U0001F310"
mastodon_social_status_url: https://mastodon.social/@joshbeckman/112972963248340393
tags:
- metrics
- observability
- noise
serial_number: 2024.NTS.151
---
_(noun) /ˈɑːmstrɒŋ ˈmɛtrɪk/_

A metric which is too noisy to be monitored (does not indicate system health), but which nonetheless is helpful in understanding [system](https://www.joshbeckman.org/notes/principles-of-system) behavior.

Named for [Jeff Armstrong](https://github.com/MahlerFive).

Example:

> We can’t set up an alert for transient errors because the number/rate of transient errors is an Armstrong metric - it fluctuates outside of our control and sometimes for desired reasons.

These should be [traced and sampled instead](https://www.joshbeckman.org/notes/554607073).
