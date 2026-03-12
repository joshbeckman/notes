# frozen_string_literal: true

require 'cgi'
require 'net/http'

module Jekyll
  class PodcastFeed < Generator
    safe true
    priority :lowest

    def generate(site)
      if site.config.dig("feed", "disable_in_development") && site.config["env"] == "development"
        Jekyll.logger.info "Podcast Feed:", "Skipping feed generation in development environment"
        return
      end

      podcast_posts = site.posts.docs
                          .select { |p| p.data["audio"] && !p.data["audio"].to_s.strip.empty? }
                          .sort_by(&:date)
                          .reverse

      return if podcast_posts.empty?

      Jekyll.logger.info "Podcast Feed:", "Generating podcast feed for #{podcast_posts.length} episodes"
      site.pages << podcast_page(site, podcast_posts)
    end

    private

    def podcast_page(site, posts)
      page = PageWithoutAFile.new(site, site.source, "feed", "podcast.rss")
      page.content = render_feed(site, posts)
      page.data["layout"] = nil
      page.data["sitemap"] = false
      page
    end

    def render_feed(site, posts)
      config = site.config
      podcast = config["podcast"] || {}
      base_url = config["url"] || ""
      author = config.dig("author", "name") || config.dig("user", "name") || ""
      email = config.dig("author", "email") || config.dig("user", "email") || ""
      title = podcast["title"] || config["title"] || "Podcast"
      description = podcast["description"] || config["description"] || ""
      image = podcast["image"] || ""
      image_url = image.start_with?("http") ? image : "#{base_url}#{image}"
      feed_url = "#{base_url}/feed/podcast.rss"
      site_url = "#{base_url}/"
      language = podcast["language"] || "en-us"
      category = podcast["category"] || "Society &amp; Culture"

      lines = []
      lines << '<?xml version="1.0" encoding="UTF-8"?>'
      lines << '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">'
      lines << "  <channel>"
      lines << "    <title>#{escape(title)}</title>"
      lines << "    <link>#{escape(site_url)}</link>"
      lines << "    <description>#{escape(description)}</description>"
      lines << "    <language>#{language}</language>"
      lines << "    <atom:link href=\"#{escape(feed_url)}\" rel=\"self\" type=\"application/rss+xml\"/>"
      lines << "    <itunes:author>#{escape(author)}</itunes:author>"
      lines << "    <itunes:owner>"
      lines << "      <itunes:name>#{escape(author)}</itunes:name>"
      lines << "      <itunes:email>#{escape(email)}</itunes:email>"
      lines << "    </itunes:owner>"
      lines << "    <itunes:explicit>false</itunes:explicit>"
      lines << "    <itunes:category text=\"#{escape(category)}\"/>"
      if image && !image.strip.empty?
        lines << "    <image>"
        lines << "      <url>#{escape(image_url)}</url>"
        lines << "      <title>#{escape(title)}</title>"
        lines << "      <link>#{escape(site_url)}</link>"
        lines << "    </image>"
        lines << "    <itunes:image href=\"#{escape(image_url)}\"/>"
      end

      posts.each do |post|
        audio_path = post.data["audio"].to_s
        audio_url = audio_path.start_with?("http") ? audio_path : "#{base_url}#{audio_path}"
        post_url = "#{base_url}#{post.url}"
        post_title = post.data["title"] || "Untitled"
        post_desc = post.data["description"] || excerpt_text(post)
        pub_date = post.date.rfc2822
        post_image = post.data["image"]
        episode_image_url = if post_image && !post_image.to_s.strip.empty?
                               post_image.start_with?("http") ? post_image : "#{base_url}#{post_image}"
                             end

        # Try to get audio file size for enclosure length attribute
        audio_length = audio_file_size(audio_path) || 0

        lines << "    <item>"
        lines << "      <title>#{escape(post_title)}</title>"
        lines << "      <link>#{escape(post_url)}</link>"
        lines << "      <guid isPermaLink=\"true\">#{escape(post_url)}</guid>"
        lines << "      <pubDate>#{pub_date}</pubDate>"
        lines << "      <description>#{escape(post_desc)}</description>"
        lines << "      <content:encoded><![CDATA[#{post.content}]]></content:encoded>"
        lines << "      <enclosure url=\"#{escape(audio_url)}\" length=\"#{audio_length}\" type=\"audio/mpeg\"/>"
        lines << "      <itunes:author>#{escape(author)}</itunes:author>"
        lines << "      <itunes:summary>#{escape(post_desc)}</itunes:summary>"
        lines << "      <itunes:image href=\"#{escape(episode_image_url)}\"/>" if episode_image_url
        lines << "      <itunes:explicit>false</itunes:explicit>"
        if post.data["tags"].is_a?(Array) && post.data["tags"].any?
          lines << "      <itunes:keywords>#{escape(post.data["tags"].join(", "))}</itunes:keywords>"
        end
        lines << "    </item>"
      end

      lines << "  </channel>"
      lines << "</rss>"
      lines.join("\n")
    end

    def escape(str)
      CGI.escapeHTML(str.to_s)
    end

    def excerpt_text(post)
      excerpt = post.data["excerpt"]
      return "" unless excerpt

      excerpt.to_s.gsub(/<[^>]+>/, "").strip.slice(0, 300) || ""
    end

    def audio_file_size(audio_path)
      return nil unless audio_path&.start_with?("/")

      # audio_path is like /assets/audio/file.mp3 — map to local filesystem
      local = "." + audio_path
      File.size(local) if File.exist?(local)
    rescue StandardError
      nil
    end
  end
end
