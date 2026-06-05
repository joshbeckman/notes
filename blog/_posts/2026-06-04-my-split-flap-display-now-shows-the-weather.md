---
layout: Post
date: 2026-06-05
title: My Split-Flap Display Now Shows the Weather
toc: true
mastodon_social_status_url: https://mastodon.social/@joshbeckman/116696183239418279
bluesky_status_url: false
tags:
- software-engineering
- tools
- weather
redirect_from:
- "/counter-redirect"
- "/counter-redirect/"
serial_number: 2026.BLG.057
---
The seven-digit split-flap display in my studio used to count the hours since I was born. Now it shows the forecast: `4077069`, a 40% chance of rain, a high of 77°F, and a low of 69°F.

I [made it a Life Clock last year](https://www.joshbeckman.org/blog/life-clock), counting up the hours of my life. I still like that idea (I even reprogrammed it to show my daughter's days of life this spring after she was born). But a number that only ever ticks up, slowly, slowly loses attention. I wanted the display to tell me something I'd actually act on when I glance up from my desk. The weather can be that thing for a while.

## Packing a forecast into seven digits

The display shows exactly seven digits and nothing else, so I had to encode a whole forecast into a single number.

I split the seven digits into three fields:

| Digits | Meaning |
|---|---|
| 1 | Rain likelihood, 0–9 |
| 2–4 | High temperature, °F |
| 5–7 | Low temperature, °F |

The **rain digit** is just the chance of rain divided by ten and floored, so a 45% chance becomes `4` and a 90% chance becomes `9`. One digit is plenty for knowing "should I be worried."

The **temperatures** each get three digits. That's easy enough for `77` (`077`) or `105`, but Chicago winters mean I needed negatives, and the display has no minus sign. So I borrowed the leading digit. Since no real temperature here reaches 900°F, a `9` in the hundreds place means "this is negative":

- `5°F` displays as `005`
- `-5°F` displays as `905`
- `-12°F` displays as `912`

One thing I like about this layout: every digit does work. The Life Clock left its leading digit parked on zero, since the hours of my life don't fill seven places yet (likely never would). That digit wouldn't flip to `1` until I crossed about 114 years old.

## Switching to tomorrow at sunset

I want to know tomorrow's forecast when the day is effectively over. That really varies, but sunset is a good rule of thumb for when I start thinking more about the next day.

So the display rolls over at sunset to show tomorrow's forecast.

## The code

The display polls a small [Val Town](https://www.val.town/x/joshbeckman/counterService) service that returns a single `number`. The data comes from [Open-Meteo](https://open-meteo.com/), which is free and needs no API key.
