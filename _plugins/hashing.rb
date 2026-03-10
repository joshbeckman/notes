# frozen_string_literal: true
require 'digest/md5'

module Jekyll
  module HashingFilter
    def md5(input)
      Digest::MD5.hexdigest(input.to_s)
    end

    def hex_color(input)
      Digest::MD5.hexdigest(input.to_s)[0, 6]
    end
  end
end

Liquid::Template.register_filter(Jekyll::HashingFilter)
