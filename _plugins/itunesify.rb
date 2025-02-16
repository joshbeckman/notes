# frozen_string_literal: true

require 'uri'

module Jekyll
  module ItunesifyFilter
    def itunesify(input)
      url = URI(input)
      url.host = 'embed.music.apple.com'
      width = nil
      # if the url has no query, then it's a full album
      # and we need to set the height to 450px to avoid scrollbars
      width = 'height="450"' if url.query.nil?
      <<~HTML
        <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" #{width} style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="#{url}"></iframe>
      HTML
    end
  end
end

Liquid::Template.register_filter(Jekyll::ItunesifyFilter)
