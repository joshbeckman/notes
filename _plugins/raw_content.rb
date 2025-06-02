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

      site.data['sequences'] = calculate_sequences(site)
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

    def calculate_sequences(site)
      all_items = site.posts.docs
      min_sequence_length = 3
      sequences = []

      all_items.each do |item|
        item.data['backlinks'] ||= []
        next if item.data['backlinks'].empty?

        item.data['backlinks'].each do |backlink_item|
          sequence = build_sequence_backwards(item, backlink_item, all_items)
          sequences << sequence if sequence.length >= min_sequence_length && !sequence_exists?(sequences, sequence)
        end
      end

      sequences
    end

    def build_sequence_backwards(end_item, current_item, _all_items)
      sequence = [end_item]
      visited_in_sequence = Set.new([end_item.url])

      while current_item && !visited_in_sequence.include?(current_item.url)
        sequence.unshift(current_item)
        visited_in_sequence.add(current_item.url)

        current_item.data['backlinks'] ||= []
        current_item = current_item.data['backlinks'].first
      end

      sequence.map { |item| { 'url' => item.url, 'title' => item.data['title'] || item.name } }
    end

    def sequence_exists?(sequences, new_sequence)
      new_urls = new_sequence.map { |item| item[:url] || item['url'] }
      sequences.any? do |existing_sequence|
        existing_urls = existing_sequence.map { |item| item[:url] || item['url'] }
        existing_urls == new_urls
      end
    end
  end
end
