module Jekyll
  module TagInInboxFilter
    def tag_in_inbox(input)
      return false if input.to_s.match?(/articles-|books-|supplementals-/)

      !@context.registers[:site].data['decimals']
        .map { |d| d.to_s.split(' ').last.downcase }
        .include? input
    end
  end
end

Liquid::Template.register_filter(Jekyll::TagInInboxFilter)
