---
layout: Post
date: '2026-01-02 16:08:30 +0000'
title: Bringing Back Webmentions
toc: true
image: "/assets/images/87ae2e1d-f1b8-4cdc-9aed-2b60e218a294.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115826718899198659
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3mbhgpsl76o2x
tags:
- personal-blog
- publishing
- blogs
- social-networks
serial_number: 2026.BLG.003
---
A year and a half ago I [dropped support for webmentions](https://www.joshbeckman.org/blog/dropping-support-for-webmentions) on this blog, but I've brought them back over the last month.

At the time I removed them, I wasn't *getting* any [webmentions](https://indieweb.org/Webmention) sent to my site and I wasn't *sending* any webmentions because the sites I was linking to didn't support them. I thought it was a dead end and instead [built POSSE for this site](https://www.joshbeckman.org/blog/rules-for-syndication-on-my-site) to the likes of Mastodon and Bluesky.

Recently, I have started [seeing webmentions](https://webmention.io/api/mentions.html?token=4N8Bpl6KX64j8VB4k5A3ww) for some of my more popular posts, and I started displaying them on post pages and added a simple little form for people to manually send them when they write their own responses to my things. I'm receiving them through [webmention.io](https://indieweb.org/webmention.io) and displaying them through their simple+fast API.

<img width="719" height="332" alt="Webmention display on my posts" src="/assets/images/87ae2e1d-f1b8-4cdc-9aed-2b60e218a294.png" />

Because I have I've started seeing a slight uptick in people sending me webmentions and I started displaying them, I figured I should re-enable my automations to *send* them to others. Here's how that works:
- I have a GitHub workflow that runs twice daily
- A Ruby script pulls [the RSS feed for my site](https://www.joshbeckman.org/subscribe/) and iterates through the recent posts
- The script uses [indieweb/webmention-client-ruby (A Ruby gem for sending and verifying Webmention notifications)](https://github.com/indieweb/webmention-client-ruby) to test/find endpoints for any sites linked-to from the post and send a mention where possible

```ruby
require 'net/http'
require 'webmention'
require 'uri'
require 'nokogiri'

class SendMentionsFromRss
  Config = Struct.new(
    'MentionsFromRssConfig',
    :feed_url,
    :item_selector,
    :item_href_proc,
    :excluded_url_matcher,
    :verbose,
    keyword_init: true
  )

  def self.execute(config)
    raise ArgumentError, 'Must use a Config' unless config.is_a?(Config)

    puts "Loading RSS feed from #{config.feed_url}"
    export_uri = URI.parse(config.feed_url)
    export_req = Net::HTTP::Get.new(export_uri)
    export_res = Net::HTTP.start(export_uri.hostname, export_uri.port, use_ssl: true) do |http|
      http.request(export_req)
    end
    raise StandardError, 'Feed request failed' unless export_res.is_a?(Net::HTTPSuccess)

    doc = Nokogiri::XML(export_res.body)
    doc.css(config.item_selector).each do |link|
      href = config.item_href_proc.call(link)
      Webmention.mentioned_urls(href).each do |url|
        if url.match?(config.excluded_url_matcher)
          puts "skipping #{url}" if config.verbose
          next
        end

        result = Webmention.send_webmention(href, url)
        if result.ok?
          puts "Sent mention of #{url} by #{href}"
        else
          puts result.message
        end
      end
    end
  end
end

site_config = SendMentionsFromRss::Config.new(
  feed_url: 'https://www.joshbeckman.org/feed.xml',
  item_selector: 'entry link',
  item_href_proc: -> (link) { link['href'] },
  excluded_url_matcher: [
    /www.joshbeckman.org/,
    /notes.joshbeckman.org/,
    /readwise.io\/open\//,
    /readwise.io\/reader\//,
    /s2.googleusercontent.com/,
    /gravatar.com\/avatar/,
    /indieweb.org\/Webmention/
  ].join('|'),
  verbose: false
)
SendMentionsFromRss.execute(site_config)
```

I hope to see it discover endpoints on sites I'm linking to and sending webmentions out in the new year.
