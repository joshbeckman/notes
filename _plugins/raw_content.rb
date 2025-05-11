# frozen_string_literal: true

module RawContent
  class Generator < Jekyll::Generator
    def generate(site)
      site.posts.docs.each do |post|
        post.data['raw_content'] = post.content
        post_backlinks = site.posts.docs.select { |other_post| backlinks?(post, other_post) }
        page_backlinks = site.pages.map do |page|
          next unless backlinks?(post, page)
          next if page.url.include?('assets')
          next if page.url.include?('.json')

          page
        end.compact
        post.data['backlinks'] = (post_backlinks + page_backlinks).compact
      end
      site.pages.each do |page|
        page.data['raw_content'] = page.content
        post_backlinks = site.posts.docs.select { |other_post| backlinks?(page, other_post) }
        page_backlinks = site.pages.map do |other_page|
          next unless backlinks?(page, other_page)
          next if other_page.url.include?('assets')
          next if other_page.url.include?('.json')

          page
        end.compact
        page.data['backlinks'] = (post_backlinks + page_backlinks).compact
      end
    end

    private

    def backlinks?(a, b)
      b.content.include?(a.url) || mastodon_backlinks?(a, b) || bluesky_backlinks?(a, b)
    end

    def mastodon_backlinks?(a, b)
      return false unless a.data['mastodon_social_status_url']
      return false if a.data['mastodon_social_status_url'] == 'false'
      return true if b.content.include?(a.data['mastodon_social_status_url'])
      return false unless b.data['in_reply_to']

      id = a.data['mastodon_social_status_url'].split('/').last
      b.data['in_reply_to'].include?(id)
    end

    def bluesky_backlinks?(a, b)
      return false unless a.data['bluesky_status_url']
      return false if a.data['bluesky_status_url'] == 'false'
      return true if b.content.include?(a.data['bluesky_status_url'])
      return false unless b.data['in_reply_to']

      id = a.data['bluesky_status_url'].split('/').last
      b.data['in_reply_to'].include?(id)
    end
  end
end
