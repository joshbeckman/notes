---
layout: Post
date: 2024-12-16 04:00:23.000000000 +00:00
title: Cross-posting From Letterboxd to Jekyll
toc: true
image: "/assets/images/03C77ACF666F433E835E19772DAEF9D6.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113662813185021566
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3ldghrg4sby2j
tags:
- code-snippets
- personal-blog
- letterboxd
- jekyll
serial_number: 2024.BLG.132
---
I want to [meet the movie\-lovers where they are](https://www.joshbeckman.org/blog/gotta-publish-where-the-people-are), so I’m going to try writing [my movie journal on Letterboxd](https://letterboxd.com/joshbeckman/). I have friends there already\. Unfortunately, Letterboxd doesn’t have an API to post *from* my site *into* it, so I have to post *there* and pull them in ​*here*​\.

So, similar to [what I built for Mastodon](http://localhost:4000/blog/pesos-mastodon-to-jekyll), I’m now pulling my Letterboxd reviews into [the watching blog](https://www.joshbeckman.org/blog/watching/) category \(PESOS\)\. I still want them here for archival/linking/discovery/etc\. And this way the other systems of syndicating them to Mastodon and Bluesky can also “just work” once imported\.

## Workflow

I tacked this on to the GitHub workflow that I run regularly to syndicate my posts into and out of this site\. The steps are pretty simple:
- Execute the `utilities/pesos_letterboxd` script
- If there are any content changes, commit them and push them up to the repository

The script, written in Ruby, pulls in the public RSS \(yes\! Bless [the public standard](https://www.joshbeckman.org/blog/using-open-protocols)  of RSS\!\) feed of my Letterboxd account’s reviews\. It then parses the XML to find reviews and imports them as Jekyll posts\. For every other post/review, it looks to see if there’s already a Jekyll post on the site that corresponds \(has the same Jekyll post frontmatter of `letterboxd_review_url`)\. Any that are already present get skipped\. Any that doesn’t gets imported as a blog post\.

The script is using the little `Post` class [I wrote for syndicating earlier/elsewhere](https://www.joshbeckman.org/blog/pesos-mastodon-to-jekyll)\.

## Code

```ruby
require 'jekyll'
require 'rexml/document'
require 'net/http'
require 'time'
require_relative 'models/post'

module PESOS
  class Letterboxd
    class Error < StandardError; end

    attr_reader :site

    def initialize
      @site = Jekyll::Site.new(Jekyll.configuration({}))
      @username = ENV.fetch('LETTERBOXD_USERNAME', 'joshbeckman')
      @site.read
    end

    def import_posts
      posts = outbox.filter do |item|
        next false if post_exists?(item['link'])

        true
      end
      posts.each { |post| import_post(post) }
    end

    def post_exists?(url)
      site.posts.docs.any? do |post|
        post.data['letterboxd_review_url'] == url
      end
    end

    def import_post(post)
      title = post['filmTitle']
      image = find_image(post['description'])
      letterboxd_id = post['link'].split('/').last
      slug = "#{post['guid']}-#{letterboxd_id}"
      post = Post.new(
        body: post['description'],
        category: 'blog/watching',
        date: Time.parse(post['watchedDate']),
        letterboxd_review_url: post['link'],
        tmdb_id: post['movieId'],
        letterboxd_id: letterboxd_id,
        bluesky_status_url: false,
        mastodon_social_status_url: false,
        image: image,
        slug: slug,
        tags: %w[letterboxd movies],
        title: title,
        rating: post['memberRating'].to_i
      )
      post.create_file
    end

    def find_image(description)
      return nil if description.nil?

      image = description.scan(/<img src="([^"]+)"/)
      return nil if image.empty?

      image.first.first
    end

    def outbox
      uri = URI.parse("https://letterboxd.com/#{@username}/rss/")
      req = Net::HTTP::Get.new(uri)
      req['Accept'] = 'application/rss+xml'
      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      raise Error, 'Outbox request failed' unless res.is_a?(Net::HTTPSuccess)

      REXML::Document.new(res.body).elements['rss/channel'].elements.map do |item|
        next unless item.name == 'item'

        item.elements.each_with_object({}) do |element, hash|
          hash[element.name] = element.text
        end
      end.compact
    end
  end
end

letterbox = PESOS::Letterboxd.new
letterbox.import_posts
```
## Future Work

Things I’d like to add in the future:
- Detect any tags in the review and set them correctly on the Jekyll post
- Figure out a way to determine the IMDB ID for the movie being reviewed \(I have a hack in mind for this, but it’s ugly\)\.

![](/assets/images/03C77ACF666F433E835E19772DAEF9D6.png)
