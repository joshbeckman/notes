# frozen_string_literal: true

require 'uri'

module Jekyll
  module YoutubeEmbedFilter
    def youtube_embed(input)
      url = URI(input)
      video_id = url.query&.match(/v=([^&]+)/)&.captures&.first
      return input unless video_id

      <<~HTML
        <iframe width="100%" height="350" src="https://www.youtube-nocookie.com/embed/#{video_id}?si=_tOsoQo4o5G_0IM1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      HTML
    end
  end
end

Liquid::Template.register_filter(Jekyll::YoutubeEmbedFilter)
