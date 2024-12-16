---
layout: Post
date: 2024-12-08 17:02:25 +0000
title: Adding Website Card Embeds to my Bluesky Posts
toc: true
image: /assets/images/E0F9F28442EB4E069171E4F4D69368CE.png
description: 
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113618400598758317
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lcsqms45562x
tags:
- bluesky
- code-snippets
---

Bluesky’s AT Protocol and client app has some interesting choices\. One of them is that links inside posts *don’t* get unfurled into previews/cards\. So when I started [syndicating links to my posts to Bluesky](https://www.joshbeckman.org/blog/crossposting-to-bluesky-from-jekyll), they didn’t really look like much: just truncated blue text\. Because every client has to provide the website preview themselves.

Their [API docs page](https://docs.bsky.app/docs/advanced-guides/posts#website-card-embeds) has some reasoning about this:
> Embedding the card content in the record ensures that it appears consistently to everyone and reduces waves of automated traffic being sent to the referenced website, but it does require some extra work by the client\.

I can understand that, but it comes with some interesting downsides:
- The client *making* the post can put *whatever* they want in that “preview” \- like something totally unrelated in a phishing attempt.
- Bluesky gets to host a *ton* of assets to power this, and it’s all just duplicated from the source of truth.
	- Literally anything \- [Daniel Mangum is hosting a website in those blobs](https://danielmangum.com/posts/this-website-is-hosted-on-bluesky/).

It’s kind of annoying to not have links “just work” on Bluesky, but I guess 99\.999% of the people there just won’t notice\.

![bluesky post preview](/assets/images/E0F9F28442EB4E069171E4F4D69368CE.png)

Anyway, this morning I added some additional logic to my Ruby script for posting to Bluesky, and now my posts have website preview cards/embeds\. The logic is pretty simple:
- Create an `embed` object on the post
- Use the title and description from the post
- If the post has an image:
	- Download it locally if it’s not already local
	- Determine its mime type
	- Upload it to Bluesky’s blob endpoint to get a blob ID
	- Add that as `thumb` on the embed

## Code

```ruby
# [omitted... see previous post for full code]
require 'open-uri'

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

    def initialize
      # [omitted... see previous post for full code]
      @jekyll_filter = JekyllFilter.new
      @content_template = Liquid::Template.parse('{{ x | strip_html | strip | escape | truncate: 140}}')
    end

    # [omitted... see previous post for full code]

    private

    def embed(post)
      card = {
        "uri": url(post),
        "title": post.data['title'],
        "description": excerpt(post)
      }
      card['thumb'] = image_blob(post) if post.data['image']
      {
        "$type": 'app.bsky.embed.external',
        "external": card
      }
    end

    def image_blob(post)
      image_path = post.data['image']
      if image_path.start_with?('http')
        image_path = URI.parse(image_path)
        image_path = File.join(Dir.tmpdir, File.basename(image_path.path))
        File.open(image_path, 'wb') do |file|
          file.write(URI.open(post.data['image']).read)
        end
      else
        image_path = File.join('.', image_path)
      end
      filetype = `file --mime-type -b #{image_path}`.strip
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.repo.uploadBlob')
      request = Net::HTTP::Post.new(uri)
      request.content_type = filetype
      request['Authorization'] = "Bearer #{@api_key}"
      request.body = File.binread(image_path)
      req_options = {
        use_ssl: uri.scheme == 'https'
      }
      res = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      raise Error, 'Image blob post request failed' unless res.is_a?(Net::HTTPSuccess)

      JSON.parse(res.body)['blob']
    end

    def excerpt(post)
      post.data['description'] ||
        @content_template.render('x' => @jekyll_filter.markdownify(post.content))
    end
  end
end
```
