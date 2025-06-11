---
layout: Post
date: 2024-12-07 17:48:19 +0000
title: "Cross-Posting From Mastodon to Jekyll"
toc: true
image: /assets/images/3476482D4C4A481B8E375E6D7EE2690C.png
description: Archiving and syndicating Mastodon posts in Jekyll
mastodon_social_status_url: https://mastodon.social/@joshbeckman/113613740967238375
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lcqoftcmzd2s
tags: 
  - mastodon
  - code-snippets
  - personal-blog
  - jekyll
---

As the inverse of how I set up [cross\-posting to Mastodon](https://www.joshbeckman.org/blog/how-to-crosspost-to-mastodon-with-jekyll) for this site \(to ensure that I am publishing on my own site and syndicating elsewhere: POSSE\), I have now set up cross\-posting *from* Mastodon *into* this site\. This inverse \- archiving content from other networks into my home site \- is called Publish Elsewhere Syndicate On Site: PESOS\.

![example Mastodon post](/assets/images/3476482D4C4A481B8E375E6D7EE2690C.png)

As part of [publishing where the people are](https://www.joshbeckman.org/blog/gotta-publish-where-the-people-are), I want to *reply* to Mastodon posts *in* Mastodon\. But I still want them here for archival/linking/discovery/etc\. So, I’ve set up a new section on this site for [replies and threads](https://www.joshbeckman.org/replies/)\. Mastodon is the first source from which I’m pulling replies\.

As a nice bonus, I’ve also configured the script to pull in any *new* posts I write on Mastodon, archived here as regular blog posts\. And I’ve set it up so they get [syndicated back out to Bluesky](https://www.joshbeckman.org/blog/crossposting-to-bluesky-from-jekyll) if they’re “plain”: not a reply and not mentioning a mastodon user directly\.

## Workflow
I tacked this on to the GitHub workflow that I run regularly to syndicate my posts *out* to Mastodon and Bluesky\. The steps are pretty simple:
1. Execute the `utilities/pesos_mastodon` script
2. If there are any code/content changes, commit them and push them up to the repository\.

The script, written in Ruby, pulls in the public feed of my Mastodon account’s posts \(praise [publicly\-readable APIs](https://www.joshbeckman.org/blog/using-open-protocols)\!\!\)\. It then finds any of those posts that are replies and imports them as Jekyll posts\. For every other post/status, it looks to see if there’s already a Jekyll post on the site that corresponds \(has the same Jekyll post frontmatter of `mastodon_social_status_url` ). Any that are already present get skipped\. Any that doesn’t gets imported as a blog post\.

Here I’m using a little `Post` class I made to assist in imports\. I also made a little `Asset` class that can download any image/video attachments to archive locally\.

## Code

```ruby
require 'jekyll'
require 'json'
require 'net/http'
require 'time'
require_relative 'models/post'
require_relative 'models/asset'

module PESOS
  class Mastodon
    class Error < StandardError; end

    attr_reader :site

    def initialize
      @site = Jekyll::Site.new(Jekyll.configuration({}))
      @site.read
    end

    def import_replies
      replies = outbox.dig('orderedItems').filter do |item|
        next false if item['type'] == 'Announce'

        item.dig('object', 'inReplyTo')
      end
      replies.each { |reply| import_reply(reply) }
    end

    def import_posts
      posts = outbox.dig('orderedItems').filter do |item|
        next false if item['type'] == 'Announce'
        next false if item.dig('object', 'inReplyTo')
        next false if post_exists?(item['object']['url'])

        true
      end
      posts.each { |post| import_post(post) }
    end

    def post_exists?(url)
      site.posts.docs.any? do |post|
        post.data['mastodon_social_status_url'] == url
      end
    end

    def import_reply(reply)
      title = reply['object']['summary'] || "Reply to #{find_mention_handle(reply['object']['tag'])}"
      image = find_image(reply['object']['attachment'])
      post = Post.new(
        body: reply['object']['content'],
        category: 'replies',
        date: Time.parse(reply['published']),
        in_reply_to: reply['object']['inReplyTo'],
        hide_title: true,
        mastodon_social_status_url: reply['object']['url'],
        canonical: reply['object']['url'],
        image: image,
        slug: reply['object']['id'].split('/').last,
        tags: ['mastodon'],
        title: title
      )
      post.create_file
    end

    def import_post(post)
      title = post['object']['summary'] || "Post to #{find_mention_handle(post['object']['tag'])}"
      image = find_image(post['object']['attachment'])
      canonical = nil
      bluesky_status_url = false
      # lock it down to mastodon if directed at another user
      if find_mention_handle(post['object']['tag'])
        canonical = post['object']['url']
        bluesky_status_url = nil
      end
      post = Post.new(
        body: post_body(post),
        category: 'blog',
        date: Time.parse(post['published']),
        hide_title: true,
        mastodon_social_status_url: post['object']['url'],
        bluesky_status_url: bluesky_status_url,
        canonical: canonical,
        image: image,
        slug: reply['object']['id'].split('/').last,
        tags: ['mastodon'],
        title: title
      )
      post.create_file
    end

    def post_body(post)
      video = find_video(post['object']['attachment'])
      if video
        "#{post['object']['content']}\n\n#{video}"
      else
        post['object']['content']
      end
    end

    def find_mention_handle(tags)
      return 'Mastodon' if tags.nil?

      mention = tags.find { |tag| tag['type'] == 'Mention' }
      return 'Mastodon' if mention.nil?

      mention['name']
    end

    def find_image(attachments)
      return nil if attachments.nil?

      image = attachments.find { |attachment| attachment['mediaType']&.include?('image') }
      return nil if image.nil?

      asset = Asset.new(url: image['url'], category: 'images')
      asset.download
      asset.public_path
    end

    def find_video(attachments)
      return nil if attachments.nil?

      video = attachments.find { |attachment| attachment['mediaType']&.include?('video') }
      return nil if video.nil?

      asset = Asset.new(url: video['url'], category: 'videos')
      asset.download
      asset.standalone_md
    end

    def outbox
      profile = ENV.fetch('MASTODON_PROFILE_URL', 'https://mastodon.social/users/joshbeckman')
      uri = URI.parse(profile + '/outbox?page=true')
      req = Net::HTTP::Get.new(uri)
      req['Accept'] = 'application/activity+json'
      req['Content-Type'] = 'application/json'
      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      raise Error, 'Outbox request failed' unless res.is_a?(Net::HTTPSuccess)

      JSON.parse(res.body)
    end
  end
end

mastodon = PESOS::Mastodon.new
mastodon.import_replies
mastodon.import_posts
```

```ruby
Post = Struct.new(
  :body,
  :category,
  :canonical,
  :description,
  :image,
  :date,
  :in_reply_to,
  :hide_title,
  :mastodon_social_status_url,
  :bluesky_status_url,
  :slug,
  :tags,
  :title,
  keyword_init: true
) do
  def create_file
    filename = "#{category}/_posts/#{date.strftime('%Y-%m-%d')}-#{slug}.md"

    File.open(filename, 'w') do |file|
      file.puts '---'
      file.puts 'layout: Post'
      file.puts "date: #{date.strftime('%Y-%m-%d %H:%M:%S %z')}"
      file.puts "title: \"#{title}\""
      file.puts 'hide_title: true' if hide_title
      file.puts "canonical: #{canonical}" if canonical
      file.puts "image: #{image}"
      file.puts "description: #{description}"
      file.puts "in_reply_to: #{in_reply_to}" if in_reply_to
      file.puts "mastodon_social_status_url: #{mastodon_social_status_url}" unless mastodon_social_status_url.nil?
      file.puts "bluesky_status_url: #{bluesky_status_url}" unless bluesky_status_url.nil?
      if tags&.any?
        file.puts 'tags:'
        tags.each do |tag|
          file.puts "  - #{tag}"
        end
      end
      file.puts '---'
      file.puts ''
      file.puts body
    end
    filename
  end
end
```

```ruby
Asset = Struct.new(:url, :category, :path, keyword_init: true) do
  def image?
    category == 'images'
  end

  def video?
    category == 'videos'
  end

  def public_path
    "/#{path}"
  end

  def standalone_md
    if image?
      "![image](#{public_path})"
    else
      "<video controls src=\"#{public_path}\"></video>"
    end
  end

  # checks if there is a file at the path
  # exits if there is
  # downloads the image from the url to the path
  def download
    return if !path.nil? && File.exist?(path)

    path = "assets/#{category}/#{url.split('/').last}" if path.nil?

    puts "Downloading #{url} to #{path}"
    `curl -L -o #{path} "#{url}"`
    # determine the filetype
    # rename the file to the path with the correct extension
    filetype = `file --mime-type -b #{path}`.strip.split('/').last
    # append the filetype to the path if it is not already there
    new_path = if path.split('.').last != filetype
                 "#{path}.#{filetype}"
               else
                 path
               end
    puts "Renaming #{path} to #{new_path}"
    `mv #{path} #{new_path}`
    self.path = new_path
  end
end
```

## Future Work
Things I’d like to add in the future:
- Detect any tags used in the Mastodon status and set them correctly on the Jekyll post


