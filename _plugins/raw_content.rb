# frozen_string_literal: true

module RawContent
  class Generator < Jekyll::Generator
    def generate(site)
      site.posts.docs.each do |post|
        post.data['raw_content'] = post.content
        post_backlinks = site.posts.docs.map do |other_post|
          next unless other_post.content.include?(post.url)

          other_post
        end.compact
        page_backlinks = site.pages.map do |page|
          next unless page.content.include?(post.url)
          next if page.url.include?('assets')
          next if page.url.include?('.json')

          page
        end.compact
        post.data['backlinks'] = (post_backlinks + page_backlinks).compact
      end
      site.pages.each do |page|
        page.data['raw_content'] = page.content
        post_backlinks = site.posts.docs.map do |other_post|
          next unless other_post.content.include?(page.url)

          other_post
        end.compact
        page_backlinks = site.pages.map do |other_page|
          next unless other_page.content.include?(page.url)
          next if other_page.url.include?('assets')
          next if other_page.url.include?('.json')

          page
        end.compact
        page.data['backlinks'] = (post_backlinks + page_backlinks).compact
      end
    end
  end
end
