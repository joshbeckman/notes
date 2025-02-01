# frozen_string_literal: true
module Jekyll
  module TagInInboxFilter
    DECIMALS = YAML.load_file('_data/decimals.yml').map { |d| d.to_s.split.last.downcase }

    def tag_in_inbox(input)
      return false if input.to_s.match?(/articles-|books-|supplementals-/)

      !DECIMALS.include? input
    end
  end
end

Liquid::Template.register_filter(Jekyll::TagInInboxFilter)
