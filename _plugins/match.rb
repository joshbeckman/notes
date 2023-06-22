module Jekyll
  module MatchFilter
    def match(input, regex)
      input.to_s.match?(Regexp.new(regex))
    end
  end
end

Liquid::Template.register_filter(Jekyll::MatchFilter)
