# frozen_string_literal: true

# Marks notes posts that have no original commentary (only blockquotes/HTML).
# Sets post.data['uncommented'] = true for use in Liquid templates.
module Uncommented
  class Generator < Jekyll::Generator
    priority :low

    def generate(site)
      site.posts.docs.each do |post|
        next unless post.data['categories']&.include?('notes')

        post.data['uncommented'] = uncommented?(post.content)
      end
    end

    private

    def uncommented?(content)
      content.each_line do |line|
        stripped = line.strip
        next if stripped.empty?
        next if stripped.start_with?('>')
        next if stripped.start_with?('<div')
        next if stripped.start_with?('</')

        return false
      end
      true
    end
  end
end
