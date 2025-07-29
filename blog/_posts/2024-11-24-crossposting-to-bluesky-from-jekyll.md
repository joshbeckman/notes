---
layout: Post
date: 2024-11-24 11:07:16.000000000 -06:00
title: Cross-posting to Bluesky from Jekyll
toc: true
image: "/assets/images/f01fc394-41e8-4b0e-a599-88b0218c57de.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113539189969260739
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lbpkxxku5c2b
tags:
- code-snippets
- personal-blog
- publishing
- blogs
- bluesky
- jekyll
serial_number: 2024.BLG.117
---
Just like how I set up [cross-posting to Mastodon](https://www.joshbeckman.org/blog/how-to-crosspost-to-mastodon-with-jekyll) for this site (to ensure that I am publishing on my own site and syndicating elsewhere: POSSE), I have now set up cross-posting from this site to [my Bluesky account](https://bsky.app/profile/joshbeckman.org).

## Workflow

It's basically the same sequence of steps, just dancing with the AT protocol instead of ActivityPub:

Then [a scheduled/cron workflow/job in GitHub Actions](https://github.com/joshbeckman/notes/blob/master/.github/workflows/posse.yml) (which hosts the repository for the code/contents of this site) runs twice a day. I use GitHub actions because they run this code for free and provide nice ways to read/manipulate the code in the repository.

The workflow is pretty simple:

1. Execute the `utilities/posse_bluesky` script
2. If there are any code/content changes, commit them and push them up to the repository.

The script, written in Ruby, calls the Bluesky API to resolve my handle and get a temporary API token. It then looks through my posts to see any that have been marked for syndication to Bluesky via Jekyll post frontmatter of `bluesky_status_url: false`. For each of those posts, it:

1. constructs a message (with a link to the canonical post and the title)
2. Identifies and adds markup for the facets present
3. Calls the Bluesky API to create a status update with that message
4. Updates the post frontmatter with a link to the resulting post on Bluesky

This way, the site can show a link to the Bluesky post and it’s all automated! About 5 hours after I post this, there will be a link at the bottom of the page to the Bluesky-syndicated link for this post.

<img width="390" alt="Image of link to Bluesky" src="/assets/images/f01fc394-41e8-4b0e-a599-88b0218c57de.png">

## Code

```ruby
require 'jekyll'
require 'json'
require 'net/http'
require 'uri'

module POSSE
  class JekyllFilter
    include Jekyll::Filters
    attr_accessor :site, :context

    def initialize(opts = {})
      @site = Jekyll::Site.new(Jekyll.configuration(opts))
      @context = Liquid::Context.new(@site.site_payload, {}, site: @site)
    end
  end

  class Bluesky
    class Error < StandardError; end

    attr_reader :site

    def initialize
      @site = Jekyll::Site.new(Jekyll.configuration({}))
      @site.read
      @jekyll_filter = JekyllFilter.new
      @content_template = Liquid::Template.parse('{{ x | strip_html | strip | escape | truncate: 140}}')
      @handle = ENV['BLUESKY_HANDLE']
      @password = ENV['BLUESKY_PASSWORD']
      @did = generate_did
      @api_key = generate_api_key(@did)
    end

    def post_all
      site.posts.docs.each do |post|
        post(post) if should_post?(post)
      end
    end

    def generate_did
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.identity.resolveHandle')
      params = { handle: @handle }
      uri.query = URI.encode_www_form(params)
      response = Net::HTTP.get_response(uri)
      raise Error, 'DID identification failed' unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body)['did']
    end

    def generate_api_key(did)
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.server.createSession')
      request = Net::HTTP::Post.new(uri)
      request.content_type = 'application/json'
      request.body = JSON.dump({
                                 'identifier' => did,
                                 'password' => @password
                               })
      req_options = {
        use_ssl: uri.scheme == 'https'
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      raise Error, 'API Key generation failed' unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body)['accessJwt']
    end

    def post(post)
      puts "Posting: #{url(post)}"
      message = "#{url(post)}\n\n#{post.data['title']}"
      status = post_status(message)
      puts "Posted:  #{url(post)} to #{status['url']}"
      bluesky_status_url = status['url']
      save_status(post, bluesky_status_url)
    end

    def save_status(post, bluesky_status_url)
      post_path = post.path
      post_content = File.read(post_path)
      new_post_content = post_content.gsub(
        /^bluesky_status_url: .*/,
        "bluesky_status_url: #{bluesky_status_url}"
      )
      File.write(post_path, new_post_content)
    end

    private

    def should_post?(post)
      posted_url = post.data['bluesky_status_url']
      !posted_url.nil? && !(posted_url || '').match?(%r{https\S*/\d+})
    end

    def post_status(status)
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.repo.createRecord')
      request = Net::HTTP::Post.new(uri)
      request.content_type = 'application/json'
      request['Authorization'] = "Bearer #{@api_key}"
      request.body = JSON.dump({
                                 'collection' => 'app.bsky.feed.post',
                                 'repo' => @did,
                                 'record' => {
                                   'text' => status,
                                   'facets' => parse_facets(status),
                                   'createdAt' => Time.now.strftime('%Y-%m-%dT%H:%M:%S.%3NZ'),
                                   '$type' => 'app.bsky.feed.post'
                                 }
                               })
      req_options = {
        use_ssl: uri.scheme == 'https'
      }
      res = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end

      raise Error, 'Status post request failed' unless res.is_a?(Net::HTTPSuccess)

      resp_body = JSON.parse(res.body)
      resp_body['url'] = "https://bsky.app/profile/#{@handle}/post/#{resp_body['uri'].split('/').last}"
      resp_body
    end

    def url(post)
      "#{site.config['url']}#{post.url}"
    end

    def parse_mentions(text)
      spans = []
      # regex based on: https://atproto.com/specs/handle#handle-identifier-syntax
      mention_regex = /[$|\W](@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)/

      text_bytes = text.encode('UTF-8')
      text_bytes.scan(mention_regex) do |match|
        spans << {
          start: $LAST_MATCH_INFO.offset(1).first,
          end: $LAST_MATCH_INFO.offset(1).last,
          handle: match[0][1..]
        }
      end
      spans
    end

    def parse_urls(text)
      spans = []
      text_bytes = text.encode('UTF-8')
      URI.extract(text, %w[http https]).each do |url|
        spans << {
          start: text_bytes.index(url),
          end: text_bytes.index(url) + url.length,
          url: url
        }
      end
      spans
    end

    def parse_facets(text)
      facets = []
      parse_mentions(text).each do |m|
        uri = URI('https://bsky.social/xrpc/com.atproto.identity.resolveHandle')
        params = { handle: m[:handle] }
        uri.query = URI.encode_www_form(params)
        response = Net::HTTP.get_response(uri)
        next if response.code.to_i == 400

        did = JSON.parse(response.body)['did']
        facets << {
          index: {
            byteStart: m[:start],
            byteEnd: m[:end]
          },
          features: [{ "$type": 'app.bsky.richtext.facet#mention', "did": did }]
        }
      end

      parse_urls(text).each do |u|
        facets << {
          index: {
            byteStart: u[:start],
            byteEnd: u[:end]
          },
          features: [
            {
              "$type": 'app.bsky.richtext.facet#link',
              # NOTE: URI ("I") not URL ("L")
              "uri": u[:url]
            }
          ]
        }
      end
      facets
    end

    def excerpt(post)
      post.data['description'] ||
        @content_template.render('x' => @jekyll_filter.markdownify(post.content))
    end
  end
end

POSSE::Bluesky.new.post_all
```

## Future Work

Things I think I'll build into this in the future:
- Add preview images/description for link facets
- If the post contents is small enough to fit in the character limit of a Bluesky post, include the full contents instead of just the title
- Reply in thread if `reply_to` is present and is a Bluesky URL
- Get reply counts/contents? and add to post frontmatter for rendering on the site
