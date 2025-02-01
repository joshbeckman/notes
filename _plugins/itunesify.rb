# frozen_string_literal: true
require 'uri'

module Jekyll
  module ItunesifyFilter
    def itunesify(input)
      url = URI(input)
      url.host = 'embed.music.apple.com'
      <<~HTML
        <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="#{url.to_s}"></iframe>
      HTML
      
    end
  end
end

Liquid::Template.register_filter(Jekyll::ItunesifyFilter)
