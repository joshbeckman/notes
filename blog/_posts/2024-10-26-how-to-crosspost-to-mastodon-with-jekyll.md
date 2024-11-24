---
layout: Post
date: 2024-10-26 00:00:00 +0000
title: "How to Cross-Post to Mastodon with Jekyll"
toc: true
image: /assets/images/77061f6f-8d03-4f1a-bff0-f21a1d6f7229.png
description: 
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113374983387877870
bluesky_status_url: false
tags: 
  - personal-blog
  - blogs
  - publishing
  - code-snippets
---



I publish posts on this site first - Publish On Site Syndicate Elsewhere (POSSE). I want this site to be the canonical source of my writing, the one true place for people (and myself) to read my notes and posts. Social networks come and go, but my site remains. But I want to [get social online](https://www.joshbeckman.org/blog/getting-social-online) and Mastodon is currently in fashion, so I want to show my stuff to people talking in that world.

Then [a scheduled/cron workflow/job in GitHub Actions](https://github.com/joshbeckman/notes/blob/master/.github/workflows/posse.yml) (which hosts the repository for the code/contents of this site) runs twice a day. I use GitHub actions because they run this code for free and provide nice ways to read/manipulate the code in the repository.

The workflow is pretty simple:
1. Execute the `utilities/posse_mastodon` script
2. If there are any code/content changes, commit them and push them up to the repository.

The script, written in Ruby, looks through my posts to see any that have been marked for syndication to Mastodon via Jekyll post frontmatter of `mastodon_social_status_url: nil`. For each of those posts, it constructs a message (with a link to the canonical post and a brief excerpt) and calls the Mastodon API to create a status update with that message. Then the script updates the post frontmatter with a link to the resulting status/message on Mastodon.

This way, the site can show a link to the Mastodon post and it's all automated! About 5 hours after I post this, there will be a link at the bottom of the page (if you expand the `Comments` section) to the Mastodon link for this post.

<img width="270" alt="Image of a link to comments on Mastodon" src="/assets/images/77061f6f-8d03-4f1a-bff0-f21a1d6f7229.png">

```rb
require 'jekyll'
require 'json'
require 'net/http'

module POSSE
  class JekyllFilter
    include Jekyll::Filters
    attr_accessor :site, :context

    def initialize(opts = {})
      @site = Jekyll::Site.new(Jekyll.configuration(opts))
      @context = Liquid::Context.new(@site.site_payload, {}, :site => @site)
    end
  end

  class Mastodon
    class Error < StandardError; end

    attr_reader :site

    def initialize
      @site = Jekyll::Site.new(Jekyll.configuration({}))
      @site.read
      @jekyll_filter = JekyllFilter.new
      @content_template = Liquid::Template.parse("{{ x | strip_html | strip | escape | truncate: 140}}")
      @token = ENV['MASTODON_SOCIAL_TOKEN']
    end

    def post_all
      site.posts.docs.each do |post|
        post(post) if should_post?(post)
      end
    end

    def post(post)
      puts "Posting: #{url(post)}"
      message = "#{post.data['title']}\n\n#{url(post)}"
      status = post_status(message)
      puts "Posted:  #{url(post)}} to #{status['url']}"
      mastodon_social_status_url = status['url']
      save_status(post, mastodon_social_status_url)
    end

    def save_status(post, mastodon_social_status_url)
      post_path = post.path
      post_content = File.read(post_path)
      new_post_content = post_content.gsub(
        /^mastodon_social_status_url: .*/,
        "mastodon_social_status_url: #{mastodon_social_status_url}"
      )
      File.write(post_path, new_post_content)
    end

    private

    def should_post?(post)
      posted_url = post.data['mastodon_social_status_url']
      !posted_url.nil? && !(posted_url || '').match?(/https\S*\/\d+/)
    end

    def post_status(status)
      uri = URI.parse('https://mastodon.social/api/v1/statuses')
      req = Net::HTTP::Post.new(uri)
      req['Authorization'] = "Bearer #{@token}"
      req['Content-Type'] = 'application/json'
      req.body = { status: status }.to_json
      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      raise Error, 'Post request failed' unless res.is_a?(Net::HTTPSuccess)

      JSON.parse(res.body)
    end

    def url(post)
      "#{site.config['url']}#{post.url}"
    end

    def excerpt(post)
      post.data['description'] ||
        @content_template.render('x' => @jekyll_filter.markdownify(post.content))
    end
  end
end

POSSE::Mastodon.new.post_all
```
