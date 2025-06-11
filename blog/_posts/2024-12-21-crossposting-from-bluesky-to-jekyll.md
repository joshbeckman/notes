---
layout: Post
date: 2024-12-21 17:25:52 +0000
title: "Cross-posting from Bluesky to Jekyll"
toc: true
image: /assets/images/94DC2326C74C413C8550148F3A798DD2.png
description: Archiving and syndicating Bluesky posts to my site
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113694841211210705
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lduow5rw6s2y
tags:
- bluesky
- code-snippets
- personal-blog
- jekyll
---

As the inverse of how I set up [cross\-posting to Bluesky](https://www.joshbeckman.org/blog/crossposting-to-bluesky-from-jekyll) for this site \(to ensure that I am publishing on my own site and syndicating elsewhere: POSSE\), I have now set up cross\-posting *from* Bluesky *into* this site\. This inverse \- archiving content from other networks into my home site \- is called Publish Elsewhere Syndicate On Site: PESOS\.

As part of [publishing where the people are](https://www.joshbeckman.org/blog/gotta-publish-where-the-people-are), I want to reply to Bluesky posts in Bluesky\. But I still want them here for archival/linking/discovery/etc\. So, I’ve set up a new section on this site for [replies and threads](https://www.joshbeckman.org/replies/)\.

As a nice bonus, I’ve also configured the script to pull in any new posts I write on Bluesky, archived here as regular blog posts\. And I’ve set it up so they get syndicated [back out to Mastodon](https://www.joshbeckman.org/blog/how-to-crosspost-to-mastodon-with-jekyll) if they’re “plain”: not a reply and not mentioning a Bluesky user directly\.

![screenshot of post on bluesky](/assets/images/94DC2326C74C413C8550148F3A798DD2.png)

## Workflow

I tacked this on to the GitHub workflow that I run regularly to syndicate my posts out to Mastodon and Bluesky\. The steps are pretty simple:
1. Execute the `utilities/pesos_bluesky` script
2. If there are any code/content changes, commit them and push them up to the repository\.

The script, written in Ruby, searches the Bluesky API for posts from my account\. \(This is kind of a backdoor way to get my account posts, but the Bluesky API kept returning server errors when I attempted to use their documented `getPosts` feed endpoint, so I’m resorting to this search interface which produces what I want because I can filter by posting account\.\)

It then finds any of those posts that are replies and imports them as Jekyll posts\. For every other post/status, it looks to see if there’s already a Jekyll post on the site that corresponds \(has the same Jekyll post frontmatter of `bluesky_status_url` ). Any that are already present get skipped\. Any that doesn’t gets imported as a blog post\.

The script is using [the little Post class I wrote for syndicating earlier/elsewhere](https://www.joshbeckman.org/blog/pesos-mastodon-to-jekyll)\. I also extracted the Bluesky auth helper methods into a module so it could be shared between the PESOS and POSSE scripts\.

## Code

```ruby
require 'jekyll'
require 'json'
require 'net/http'
require 'time'
require_relative 'bluesky/auth'
require_relative 'models/post'
require_relative 'models/asset'

module PESOS
  # Pulls in posts and replies from Bluesky
  class Bluesky
    include ::Bluesky::Auth

    class Error < StandardError; end

    attr_reader :site

    def initialize
      @site = Jekyll::Site.new(Jekyll.configuration({}))
      @handle = ENV.fetch('BLUESKY_HANDLE')
      @did = generate_did(@handle)
      @api_key = generate_api_key(@did, ENV['BLUESKY_PASSWORD'])
      @site.read
    end

    def import_replies
      replies = outbox.filter do |item|
        item.dig('record', 'reply', 'parent', 'uri')
      end
      replies.each { |reply| import_reply(reply) }
    end

    def import_posts
      posts = outbox.filter do |item|
        next false if item.dig('record', 'reply', 'parent', 'uri')
        next false if post_exists?(resolve_post_uri(item['uri']))

        true
      end
      posts.each { |post| import_post(post) }
    end

    def post_exists?(url)
      slug = url.split('/').last
      site.posts.docs.any? do |post|
        next false unless post.data['bluesky_status_url']

        post.data['bluesky_status_url'].include?(slug)
      end
    end

    def import_reply(reply)
      record = reply['record']
      reply_uri = record.dig('reply', 'parent', 'uri')
      title = "Reply to #{find_did_handle(reply_uri)}"
      canonical = resolve_post_uri(reply['uri'])
      image = find_image(record['embed'])
      post = Post.new(
        body: embed_facets(record['text'], record['facets']),
        category: 'replies',
        date: Time.parse(record['createdAt']),
        in_reply_to: resolve_post_uri(reply_uri),
        bluesky_status_url: canonical,
        canonical: canonical,
        image: image,
        slug: reply['uri'].split('/').last,
        tags: ['bluesky'],
        title: title
      )
      post.create_file
    end

    def import_post(post)
      record = post['record']
      title = 'Post to Bluesky'
      post_uri = resolve_post_uri(post['uri'])
      canonical = nil
      mastodon_social_status_url = false
      image = find_image(post['embed'])
      # lock it down to bluesky if directed at another user
      if mention?(record['facets'])
        canonical = post_uri
        mastodon_social_status_url = nil
      end
      post = Post.new(
        body: embed_facets(record['text'], record['facets']),
        category: 'blog',
        date: Time.parse(record['createdAt']),
        hide_title: true,
        mastodon_social_status_url: mastodon_social_status_url,
        bluesky_status_url: post_uri,
        canonical: canonical,
        image: image,
        slug: post['uri'].split('/').last,
        tags: ['bluesky'],
        title: title
      )
      post.create_file
    end

    def find_image(embed)
      return nil if embed.nil?

      if embed['$type'] == 'app.bsky.embed.images#view'
        image_url = embed['images'].first['fullsize']
        return nil if image_url.nil?

        asset = Asset.new(url: image_url, category: 'images')
        asset.download
        asset.public_path
      elsif embed['$type'] == 'app.bsky.embed.external#view'
        embed['external']['thumb']
      end
    end

    def mention?(facets)
      facets&.any? do |facet|
        facet['features']&.any? do |feature|
          feature['$type'] == 'app.bsky.richtext.facet#mention'
        end
      end
    end

    def embed_facets(text, facets)
      return text if facets.nil? || facets.empty?

      facets.each do |facet|
        next unless facet['features']

        facet['features'].each do |feature|
          if feature['$type'] == 'app.bsky.richtext.facet#link'
            bytestart = facet['index']['byteStart']
            byteend = facet['index']['byteEnd']
            text.insert(bytestart, '[')
            text.insert(byteend + 1, "](#{feature['uri']})")
          elsif feature['$type'] == 'app.bsky.richtext.facet#mention'
            bytestart = facet['index']['byteStart']
            byteend = facet['index']['byteEnd']
            text.insert(bytestart, '[')
            text.insert(byteend + 1, "](#{resolve_did_to_profile(feature['did'])})")
          end
        end
      end
      text
    end

    def find_did_handle(uri)
      return 'Bluesky' if uri.nil?

      did = extract_did(uri)
      return 'Bluesky' if did.nil?

      resolve_handle(did) || 'Bluesky'
    end

    def outbox
      uri = URI.parse("https://bsky.social/xrpc/app.bsky.feed.searchPosts?author=@{@handle}&q=*")
      request = Net::HTTP::Get.new(uri)
      request.content_type = 'application/json'
      request['Authorization'] = "Bearer #{@api_key}"
      req_options = {
        use_ssl: uri.scheme == 'https'
      }
      res = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end

      unless res.is_a?(Net::HTTPSuccess)
        puts res.body
        raise Error, 'Status post request failed'
      end

      resp_body = JSON.parse(res.body)
      resp_body['posts']
    end
  end
end

bluesky = PESOS::Bluesky.new
bluesky.import_replies
bluesky.import_posts
```

```ruby
module Bluesky
  # Authentication against the Bluesky API
  module Auth
    def generate_did(handle)
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.identity.resolveHandle')
      params = { handle: handle }
      uri.query = URI.encode_www_form(params)
      response = Net::HTTP.get_response(uri)
      unless response.is_a?(Net::HTTPSuccess)
        puts response.body
        raise Error, 'DID identification failed'
      end

      JSON.parse(response.body)['did']
    end

    def resolve_handle(did)
      uri = URI.parse("https://plc.directory/#{did}")
      response = Net::HTTP.get_response(uri)
      unless response.is_a?(Net::HTTPSuccess)
        return nil if response.code&.tos == '404'

        puts response.body
        raise Error, 'Handle resolution failed'
      end

      at_handle = JSON.parse(response.body)['alsoKnownAs'].first
      "@#{at_handle.split('at://').last}"
    end

    def resolve_did_to_profile(did)
      "https://bsky.app/profile/#{did}"
    end

    def extract_did(uri)
      match = uri.match(%r{did:plc:[^/]*})
      return nil if match.nil?

      match[0]
    end

    # at://<DID>/<COLLECTION>/<RKEY> resolves to https://bsky.app/profile/<DID>/post/<RKEY>
    # example URI:
    # at://did:plc:pko7wbcggok753hnvndxh3ni/app.bsky.feed.post/3ld75432fq42c
    def resolve_post_uri(uri)
      did = extract_did(uri)
      rkey = uri.split('/').last
      return nil if did.nil? || rkey.nil?

      pretty_did = resolve_handle(did)
      unless pretty_did.nil?
        did = pretty_did.split('@').last
      end
      "https://bsky.app/profile/#{did}/post/#{rkey}"
    end

    def generate_api_key(did, password)
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.server.createSession')
      request = Net::HTTP::Post.new(uri)
      request.content_type = 'application/json'
      request.body = JSON.dump({
                                 'identifier' => did,
                                 'password' => password
                               })
      req_options = {
        use_ssl: uri.scheme == 'https'
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      unless response.is_a?(Net::HTTPSuccess)
        puts response.body
        raise Error, 'API Key generation failed'
      end

      JSON.parse(response.body)['accessJwt']
    end
  end
end
```

## Future

Things I’d like to add in the future:
- Detect any tags used in the Bluesky post and set them correctly on the Jekyll post
- Detect any embedded videos and import them
- Use an LLM to generate a title for the post upon import
