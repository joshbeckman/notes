---
layout: Post
date: '2026-03-01 01:15:00 +0000'
title: ComEd Hourly Pricing as Calendar Events
toc: true
image: "/assets/images/7da27360-4fa4-4eb5-8fbb-9aa80f34e9b7.png"
description: I built an iCal feed of ComEd electricity price changes so I can plan
  around cheap hours from my calendar.
mastodon_social_status_url: https://mastodon.social/@joshbeckman/116152347327783519
bluesky_status_url: false
tags:
- tools
- consumption
- time
- open-source
serial_number: 2026.BLG.036
---
ComEd electricity prices change every hour — sometimes swinging several cents between midnight and mid-afternoon. After [enrolling in hourly pricing](/notes/2026-03-01-enrolling-in-hourly-pricing-for-comed-electricity), I realized I didn't want to check a dashboard to know when power is cheap. I wanted to see it on my calendar, right next to the rest of my day.

Same impulse that led me to build [iCal feeds for my entire blog history](/blog/ical-feeds-for-a-jekyll-site). A calendar is the tool I already use for planning around time. Price data _is_ time data — it just happens to come from a utility instead of a CMS. If I can see that electricity drops to near-zero at 2am and spikes at 6pm, I can plan around it the same way I plan around meetings.

So I built a small [Val.town server](https://www.val.town/x/joshbeckman/comed-hourly-pricing-calendar/code/README.md) that generates an iCal feed of price changes. It pulls the last 24 hours of 5-minute prices from ComEd's [public API](https://hourlypricing.comed.com/hp-api/), averages them into hourly buckets, and grabs the next day's prices from their (undocumented) day-ahead endpoint. Then it compares consecutive hours and emits a calendar event whenever the price shifts by more than a threshold:

```
↑ 3.7c/kWh (+0.9c)
↓ 2.1c/kWh (-0.3c)
```

Stable hours produce no event — gaps in the calendar mean the price isn't moving. The sensitivity, lookback window, and lookahead are all configurable via query parameters, so I (or you!) can tune it to only surface the swings I care about.

<img width="582" height="355" alt="The pricing changes display in my calendar app" src="/assets/images/7da27360-4fa4-4eb5-8fbb-9aa80f34e9b7.png" />

The next step is pairing this with batteries to buffer my high-draw appliances — grow lights, the computer desk — into cheap hours automatically. For now, just seeing the price rhythm on my calendar alongside everything else is enough to shift my habits. [Everywhere a calendar](/blog/everywhere-a-calendar).
