---
layout: Post
date: '2026-06-09 21:30:00 +0000'
title: Cross-posting From Record Club to Jekyll
toc: true
description: Pulling my Record Club album reviews into my site via PESOS, the same way I do with Letterboxd, plus auto-resolving Apple Music links for embeds.
image: /assets/images/d40ef17f-0261-4c6d-bc05-bf20f80918c3.png
tags:
- record-club
- personal-blog
- jekyll
- music
---

I review the movies I watch [on Letterboxd](https://www.joshbeckman.org/blog/crossposting-from-letterboxd-to-jekyll). Now I'm doing the same for the albums I listen to, [on Record Club](https://record.club/joshbeckman). I want to [meet the music-lovers where they are](https://www.joshbeckman.org/blog/gotta-publish-where-the-people-are) and in writing on Letterboxd I've realized that a dedicated platform for a medium encourages me to write and enriches my enjoyment. So, just like with Letterboxd, I'm pulling those reviews back into [my listening blog](https://www.joshbeckman.org/blog/listening/) via PESOS.

![The Record Club homepage](/assets/images/d40ef17f-0261-4c6d-bc05-bf20f80918c3.png)

The shape of this is identical to my Letterboxd importer: read a public RSS feed, find reviews that aren't already on my site, and write them out as Jekyll posts. Bless [the open standard of RSS](https://www.joshbeckman.org/blog/using-open-protocols).

## Three differences from Letterboxd

**The feed mixes activity types.** Record Club's RSS includes more than reviews. It also logs when I add an album to my queue or my rotation. For now, I only want the actual reviews, so I filter on the phrasing of the item title, which is the only place that distinguishes them:

```ruby
# Record Club mixes review items in with queue/rotation additions in the
# same feed. Only the "listened to and rated" items carry a review body and
# a star rating, so we anchor on that phrasing to skip the rest.
REVIEW_TITLE = /listened to and rated an album: '(.+)' by (.+) - ([★½]+)\z/
```

**The rating lives in the title, as stars.** Letterboxd gave me a numeric `memberRating` field. Record Club embeds the rating right in the item title, rendered as star glyphs like `★★★½`. So I parse the glyphs back into a number:

```ruby
def parse_rating(stars)
  stars.count('★') + (stars.include?('½') ? 0.5 : 0)
end
```

**Cloudflare sometimes mangles the feed.** Record Club sits behind Cloudflare, which occasionally serves a challenge to a plain Ruby request and injects a trailing `<script>` after the closing `</rss>` tag. That breaks a strict XML parser. A browser-like `User-Agent` mostly avoids the challenge, and trimming anything past `</rss>` handles the rest:

```ruby
req['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...'
# ...
# Trim anything past the closing tag; Cloudflare can append injected markup
# after </rss> that would otherwise break the strict XML parser.
feed = res.body[/\A.*<\/rss>/m] || res.body
```

## Resolving a streaming link

Record Club's feed doesn't carry a streaming link, and I wanted one for the "listen on your favorite service" link in the post metadata, and an Apple Music embed in the post body.

The free iTunes Search API resolves an Apple Music album URL from the artist and album name:

```ruby
uri = URI.parse('https://itunes.apple.com/search')
uri.query = URI.encode_www_form(term: "#{artist} #{album}", entity: 'album', limit: 5)
```

A bad embed is worse than a missing one, so I only accept a result when both the artist and the album name plausibly match what Record Club gave me:

```ruby
def plausible_match?(result, artist, album)
  norm = ->(s) { s.to_s.downcase.gsub(/[^a-z0-9]/, '') }
  artist_ok = norm.call(result['artistName']).include?(norm.call(artist)) ||
              norm.call(artist).include?(norm.call(result['artistName']))
  album_ok = norm.call(result['collectionName']).include?(norm.call(album)) ||
             norm.call(album).include?(norm.call(result['collectionName']))
  artist_ok && album_ok
end
```

This guard earned its keep immediately. One of my first imports was the Nine Inch Noize album that Record Club had labeled with the artist as the album name. The top iTunes results were Nine Inch Nails and a TRON soundtrack. The guard declined them all, and I added the correct link by hand. A miss I can fix; a confident wrong answer I might not even notice.

## Workflow

Like my other importers, this runs as a step in the GitHub Actions workflow I use to syndicate posts into and out of my site. It runs the script, and if there are content changes, it commits and pushes them. Once a review lands here, the existing machinery that syndicates out to [Mastodon](https://www.joshbeckman.org/blog/how-to-crosspost-to-mastodon-with-jekyll) and [Bluesky](https://www.joshbeckman.org/blog/crossposting-to-bluesky-from-jekyll) just works, per [my syndication rules](https://www.joshbeckman.org/blog/rules-for-syndication-on-my-site).

So now my movies and my music both live here, archived and linkable and discoverable, no matter which platform I happened to write them on first.
