# frozen_string_literal: true
require 'uri'

module Jekyll
  module DomainifyFilter
    def domainify(input)
      URI(input).host
    end
  end
end

Liquid::Template.register_filter(Jekyll::DomainifyFilter)
