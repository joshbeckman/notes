# frozen_string_literal: true

require_relative '../utilities/models/sequence'

module RawContent
  class Generator < Jekyll::Generator
    def generate(site)
      posts = site.posts.docs
      pages = site.pages.reject { |p| p.url.include?('assets') || p.url.include?('.json') }
      all_docs = posts + pages

      backlinks_index = build_backlinks_index(all_docs)

      all_docs.each do |doc|
        doc.data['raw_content'] = doc.content
        doc.data['backlinks'] = backlinks_index[doc.url] || []
      end

      calculate_category_navigation(site)

      site.data['sequences'] = calculate_sequences(site)
      site.data['anchors'] = calculate_anchors(site)
    end

    private

    def build_backlinks_index(all_docs)
      backlinks_index = Hash.new { |h, k| h[k] = [] }

      mastodon_urls = {}
      bluesky_urls = {}
      mastodon_ids = {}
      bluesky_ids = {}

      all_docs.each do |doc|
        masto_url = doc.data['mastodon_social_status_url']
        if masto_url && masto_url != 'false'
          mastodon_urls[masto_url] = doc
          mastodon_ids[masto_url.split('/').last] = doc
        end

        bsky_url = doc.data['bluesky_status_url']
        if bsky_url && bsky_url != 'false'
          bluesky_urls[bsky_url] = doc
          bluesky_ids[bsky_url.split('/').last] = doc
        end
      end

      all_urls = all_docs.map(&:url)

      all_docs.each do |doc|
        content = doc.content

        all_urls.each do |target_url|
          next if target_url == doc.url

          if content.include?(target_url)
            backlinks_index[target_url] << doc
          end
        end

        mastodon_urls.each do |masto_url, target_doc|
          next if target_doc.url == doc.url

          if content.include?(masto_url)
            backlinks_index[target_doc.url] << doc unless backlinks_index[target_doc.url].include?(doc)
          end
        end

        bluesky_urls.each do |bsky_url, target_doc|
          next if target_doc.url == doc.url

          if content.include?(bsky_url)
            backlinks_index[target_doc.url] << doc unless backlinks_index[target_doc.url].include?(doc)
          end
        end

        next unless doc.data['in_reply_to']

        in_reply_to = doc.data['in_reply_to']

        mastodon_ids.each do |id, target_doc|
          next if target_doc.url == doc.url

          if in_reply_to.include?(id)
            backlinks_index[target_doc.url] << doc unless backlinks_index[target_doc.url].include?(doc)
          end
        end

        bluesky_ids.each do |id, target_doc|
          next if target_doc.url == doc.url

          if in_reply_to.include?(id)
            backlinks_index[target_doc.url] << doc unless backlinks_index[target_doc.url].include?(doc)
          end
        end
      end

      backlinks_index
    end

    def calculate_category_navigation(site)
      posts_by_category = {}
      site.posts.docs.each do |post|
        next unless post.data['categories'] && !post.data['categories'].empty?

        category = post.data['categories'].last
        posts_by_category[category] ||= []
        posts_by_category[category] << post
      end
      posts_by_category.each do |_category, posts|
        posts.each_with_index do |post, index|
          if index > 0
            prev_post = posts[index - 1]
            post.data['prev_post_in_category'] = {
              'url' => prev_post.url,
              'title' => prev_post.data['title']
            }
          end

          next unless index < posts.length - 1

          next_post = posts[index + 1]
          post.data['next_post_in_category'] = {
            'url' => next_post.url,
            'title' => next_post.data['title']
          }
        end
      end
    end

    def calculate_sequences(site)
      all_items = site.posts.docs
      min_sequence_length = 4
      sequences = []
      seen_url_keys = Set.new

      all_items.each do |item|
        item.data['backlinks'] ||= []
        next if item.data['backlinks'].empty?

        item.data['backlinks'].each do |backlink_item|
          sequence_posts = build_sequence_backwards(item, backlink_item, all_items)
          next if sequence_posts.length < min_sequence_length

          url_key = sequence_posts.map(&:url).join("\0")
          next if seen_url_keys.include?(url_key)

          seen_url_keys.add(url_key)
          sequences << Sequence.create(sequence_posts)
        end
      end

      sequences = remove_contained_sequences(sequences)

      sequences.each do |seq|
        seq.posts.each do |post|
          post.data['sequences'] ||= []
          post.data['sequences'] << seq
          post.data['sequences'].uniq!
        end
      end

      sequences.sort_by { |seq| seq.posts.length }.reverse
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

      sequence
    end

    def remove_contained_sequences(sequences)
      sequences_to_keep = []

      sorted = sequences.sort_by { |seq| seq.posts.length }.reverse
      sorted.each do |current_seq|
        current_urls = current_seq.posts.map(&:url)

        is_contained = sequences_to_keep.any? do |kept_seq|
          kept_urls = kept_seq.posts.map(&:url)
          sequence_contained_in?(current_urls, kept_urls)
        end

        sequences_to_keep << current_seq unless is_contained
      end

      sequences_to_keep
    end

    def sequence_contained_in?(shorter_urls, longer_urls)
      return false if shorter_urls.length >= longer_urls.length

      (0..longer_urls.length - shorter_urls.length).any? do |start_index|
        longer_urls[start_index, shorter_urls.length] == shorter_urls
      end
    end

    def calculate_anchors(site)
      all_posts = site.posts.docs
      posts_with_backlinks = all_posts.select { |post| post.data['backlinks'] && !post.data['backlinks'].empty? }

      return [] if posts_with_backlinks.empty?

      posts_with_counts = posts_with_backlinks.map do |post|
        {
          'url' => post.url,
          'title' => post.data['title'],
          'date' => post.date,
          'backlink_count' => post.data['backlinks'].length,
          'backlinks' => post.data['backlinks'].map { |bl| { 'url' => bl.url, 'title' => bl.data['title'] } }
        }
      end

      posts_with_counts.sort_by! { |post| post['backlink_count'] }.reverse!

      top_5_percent_count = [(posts_with_counts.length * 0.05).ceil, 1].max
      posts_with_counts.first(top_5_percent_count)
    end
  end
end
