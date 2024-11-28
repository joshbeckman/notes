# frozen_string_literal: true

module RawContent
  class Generator < Jekyll::Generator
    def generate(site)
      site.posts.docs.each do |post|
        post.data['raw_content'] = post.content
        # TODO: extract any backlinks from the post content and add them to the post data
      end
    end
  end
end
