---
layout: Post
date: '2025-05-05 13:03:28 +0000'
title: How I Make Hiking and Running Overview Videos from GPS Data
toc: true
image: "/assets/images/94453524-70d1-41f6-a7a2-eba2221bcc3c.png"
description:
mastodon_social_status_url: false
bluesky_status_url: false
tags:
- tools
- hiking
- running
- videography
---


I've been making these overview videos of my bigger/recent hikes ([Grand Canyon Royal Arch Loop](https://www.joshbeckman.org/blog/traveling/hiking-the-grand-canyon-royal-arch-loop), [Cirque of The Towers](https://www.joshbeckman.org/blog/traveling/cirque-of-the-towers-2024)). It's not hard, these days, to get a bird's-eye overview reel of your GPS-tracked run or hike with your smartwatch or smartphone. And I find it's a pretty reminder of the route you took - rather than the route you planned.

<img width="614" alt="video recap example" src="/assets/images/94453524-70d1-41f6-a7a2-eba2221bcc3c.png" />

## Get the GPX files

To start, you need to get the GPS data into a downloadable file format: GPX. If you're using Garmin, you can `Export` any activity's GPX file directly in their web page. If you're using an Apple Watch or iOS/Android device (tracking using their OS health apps), you should use the [GPX Viwewer](https://apps.apple.com/us/app/gpx-viewer/id1511582047) app to export the GPX file for your workout.

## Edit the GPX files

For my long backpacking trips, I will often record multiple "hikes" in a single day (because we stop for lunch or rest or whatever). But I really think of each day as a single hike, so I want to create a video stitching multiple "hikes" together into a single hike. If you don't need to combine segments, you can skip this part.

To merge GPX files, I upload them into [gpx.studio — the online GPX file editor](https://gpx.studio/). From there, you can combine multiple segments into a single one and then export the resulting (combined) GPX file.

## Create the video

I drop the final GPX file into [Rumbo (GPS trails to videos recaps)](https://www.rumbo.world/home) and generate the video. It has a number of options you can play with and then they send you a link to download the resulting MP4.

<video controls src="/assets/videos/royal-arch-loop-day-5.mp4"></video>

## Simple Version

If you're ok paying a bit of money and having a bit less control over what is generated (but arguably a prettier final result), I would recommend [Relive](https://www.relive.com/): an app you can download to your phone that does most of this and also will include photos you take during the hike/run in the final video output.
