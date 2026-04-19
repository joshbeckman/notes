# frozen_string_literal: true

module Jekyll
  module RandomListItemFilter
    def random_list_item(input)
      items = input.to_s.scan(/^- .+$/)
      return "" if items.empty?

      items.sample
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomListItemFilter)
