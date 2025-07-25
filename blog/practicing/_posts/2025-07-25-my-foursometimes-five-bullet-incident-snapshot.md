---
layout: Post
date: '2025-07-25 20:22:35 +0000'
title: My “Four-(Sometimes Five-) Bullet” Incident Snapshot
toc: true
image: "/assets/images/956166c6-08dc-4d91-b5f5-60b333b506ff.jpeg"
description: Detection → Mitigation → Remediation → Impact (+ Comms) in under sixty
  seconds
mastodon_social_status_url: 'false'
bluesky_status_url: 'false'
tags:
- metrics
- software-engineering
---


![A tree falls in the forest](/assets/images/956166c6-08dc-4d91-b5f5-60b333b506ff.jpeg)

I’ve written more incident docs than I'll ever remember, and the ones that cause the fewest quesitons all open with the same, brutally short rubric:

1. Detection speed – slow | medium | fast  
2. Mitigation speed – slow | medium | fast  
3. Remediation speed – N/A | slow | medium | fast  
4. Impact scope – low | medium | high  
5. Communication speed – N/A | slow | medium | fast  <!-- optional -->

That’s the whole elevator pitch: *How long did we fly blind? How long were users hurt? How long until systems were clean? How big was the blast radius? How quickly did we tell people?*

## Terms

Why “mitigation,” not “resolution”?  
“Resolution” usually means *completely finished* (see ITIL, StatusPage). Bullet #2 is only “the bleeding stopped,” not “root cause removed.” Industry vernacular calls that **mitigation** (think MTTM (mean time to mitigate) in Google SRE books), so I do too.

## Rough Aces

Defining the axes (recap)

• Detection    Fast < 5 m · Med 5-30 m · Slow > 30 m  
• Mitigation    Fast < 15 m · Med 15-60 m · Slow > 60 m  
• Remediation    Fast < 24 h · Med 24 h-7 d · Slow > 7 d · N/A  
• Impact    Low < 1 % traffic · Med 1-10 % · High > 10 % (pick one driver)  
• Communication    Fast < 10 m · Med 10-30 m · Slow > 30 m · N/A  

## Context

Where this snapshot fits in the wider world:

| Snapshot axis | Google SRE / DORA | PagerDuty / Atlassian IR | NIST PICERL | What you add |
|---------------|------------------|--------------------------|-------------|--------------|
| Detection | MTTD | “Detection” | Identification | — |
| Mitigation | MTTM / Containment | Mitigation | Containment | Clear boundary before root-fix |
| Remediation | MTTR (restore) | Resolution | Eradication + Recovery | Explicit timer to “clean state” |
| Impact | Severity label (implied) | Sev label | Severity | Explicit numeric / % metric |
| Comms | Time-to-Ack / First Update | TTFU (First Update) | Notification Time | Optional but visible |

Think of the snapshot as the common denominator of those frameworks without the ceremony. If Finance or Legal later need **cost of impact** or **regulatory notification timestamps**, I link to that detail in the retro instead of bloating the headline.

## Example

Example snapshot

```
Detection:     Medium — 7 min (Grafana checkout-error alarm)
Mitigation:    Fast   — flag rollback at 12 min
Remediation:   Medium — schema reverted in 36 h
Impact:        High   — 22 % of checkouts, ≈ $2.6 M stalled GMV
Comms:         Fast   — StatusPage + Support macro at 9 min
```

One screen, five numbers, whole story.

## Template

Steal-this-template

```md
### Incident Snapshot
- Detection speed:     <fast|medium|slow> — X min (source)
- Mitigation speed:    <fast|medium|slow> — Y min (action)
- Remediation speed:   <fast|medium|slow|N/A> — Z h/d (action)
- Impact scope:        <low|medium|high> — metric
- Communication speed: <fast|medium|slow|N/A> — N min (first stakeholder update)  <!-- optional -->
```

Paste it, fill it in under two minutes, and get back to fixing things that matter. Incidents are inevitable but muddy recaps aren’t.
