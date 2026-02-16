---
layout: Post
date: '2026-02-16 17:00:00 +0000'
title: My Entire Blog History as Calendar Events
toc: true
image:
description: I built a Jekyll plugin that generates iCal feeds so I can see my entire
  posting history in my calendar.
mastodon_social_status_url: https://mastodon.social/@joshbeckman/116081557976251494
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3meym75ojrw23
tags:
- jekyll
- personal-blog
- tools
- time
serial_number: 2026.BLG.030
---
I have over 3,600 posts on this site — blog entries, exercise logs, movie reviews, concert notes — spanning years. I wanted to see all of them on my calendar. Not in a feed reader, where they scroll past and vanish, but on a calendar, where I can see that I ran a half marathon the same week I stopped blogging — or that a burst of note-taking coincided with a conference trip.

RSS couldn't do it. I'd been using [RSS to Cal](https://www.rsstocal.com/) to bridge my feed into my calendar, but RSS only carries the last 25 items. And since the conversion was generic, I couldn't include richer calendar data like GPS coordinates for my exercise posts or feature images.

So I built a [Jekyll plugin](https://github.com/joshbeckman/notes/blob/master/_plugins/ical_feed.rb) that generates [iCal](https://en.wikipedia.org/wiki/ICalendar) (`.ics`) feeds for this site — every post, with structured calendar metadata. You can subscribe to them from the [subscribe page](/subscribe#ical-feeds).

## Why iCal Instead of Just RSS?

RSS and iCal serve different reading patterns. RSS is a stream — you see the latest items and move on. A calendar is spatial. You can scroll back through months and years, see clusters of activity, notice gaps. Laid out on a calendar, my posts tell a different story than they do in a feed reader.

Two years ago I wrote about wanting [everywhere a calendar](/blog/everywhere-a-calendar) — the idea that most of my data has a time component and I should be able to view it in the tools I already use for visualizing time. I subscribe to moon phase, holiday, and astronomy calendars. I already built a [heatmap calendar](/heatcal) for this site. But I still couldn't see my actual posts as calendar events.

I already have a calendar app open all day, on many devices. Adding my posts there means I don't need a separate app to review what I've been up to or match them up to other activities in my life. As always, [your app is not better than an open protocol](/blog/using-open-protocols). When I publish data as iCal, any calendar client can consume it without learning or maintaining a new interface.

## How It Works

The plugin is a single `Jekyll::Generator` that runs at build time. It reads the same `feed.categories` config that [jekyll-feed](https://github.com/jekyll/jekyll-feed) uses, so the iCal feeds mirror the RSS feeds exactly: one [unified feed](/feed.ics) and one per category ([blog](/feed/blog.ics), [notes](/feed/notes.ics), [exercise](/feed/exercise.ics), etc.).

Each post becomes a `VEVENT` — an all-day calendar event on the post's publish date. The event includes:

- **Title and description** — the post title as the event summary, with the description frontmatter (or an auto-generated excerpt) as the event description
- **URL** — a link back to the post
- **Categories** — the post's tags, which calendar apps can use for filtering
- **Image** — a URI reference to the post's feature image (Apple Calendar renders these)
- **Geo coordinates** — for exercise posts that have GPS data (pulled from Strava via frontmatter), so they show up on the calendar's map view

Here's the core of the VEVENT generation:

```ruby
posts.each do |post|
  lines << "BEGIN:VEVENT"
  lines << "UID:#{ical_escape(post.id)}@joshbeckman.org"
  lines << "DTSTAMP:#{now}"
  lines << "DTSTART;VALUE=DATE:#{post.date.strftime("%Y%m%d")}"
  lines << "SUMMARY:#{ical_escape(post.data["title"] || "Untitled")}"

  desc = build_description(post)
  lines << "DESCRIPTION:#{ical_escape(desc)}" unless desc.empty?

  url = "#{base_url}#{post.url}"
  lines << "URL:#{url}"

  tags = post.data["tags"]
  if tags.is_a?(Array) && !tags.empty?
    lines << "CATEGORIES:#{tags.map { |t| ical_escape(t) }.join(",")}"
  end

  lines << "TRANSP:TRANSPARENT"
  lines << "END:VEVENT"
end
```

I chose to generate the iCal format directly rather than pulling in a gem. The subset of [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545) I needed is small: a `VCALENDAR` wrapper, `VEVENT` blocks, and three formatting rules — `\r\n` line endings, line wrapping at 75 bytes, and backslash escaping for text values. A library would add a dependency for what ended up being ~130 lines of Ruby.

## Full History

RSS feeds typically cap at 25 or 50 recent items. That makes sense for RSS — nobody wants to import thousands of items into their feed reader on first subscribe. But the whole point of this calendar was to see my history through the past, so these feeds include every post. The unified feed currently has over 3,600 events.

This pairs well with the [heatmap calendar](/heatcal) I built last year. That gives a birds-eye visual of posting density, while the iCal feeds let me drill into specific days and see exactly what I was writing about alongside the rest of my life.

## Subscribing

You can subscribe to any of the feeds from your calendar app:

- [All posts](/feed.ics)
- [Blog](/feed/blog.ics)
- [Notes](/feed/notes.ics)
- [Exercise](/feed/exercise.ics)
- [Replies](/feed/replies.ics)

In Apple Calendar: File > New Calendar Subscription, then paste the URL. In Google Calendar: Other calendars > From URL.

> [!WARNING]
> The unified feed is ~1.4MB — slightly over Google Calendar's 1MB import limit. The per-category feeds are all well under and are probably more useful for subscribing anyway. Apple Calendar handles the full feed without issue.

> [!NOTE]
> The feeds include a `REFRESH-INTERVAL` hint of one day, though Google tends to refresh on its own schedule regardless.
