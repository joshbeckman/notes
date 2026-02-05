require 'cgi'

module Jekyll
  module MediaWrapper
    def wrap_media(content)
      return '' if content.nil?

      # Wrap standalone img tags with figure and div
      content = content.gsub(/<img([^>]+)>/i) do |match|
        img_tag = match

        # Extract alt text for data-tooltip (handle quote styles separately
        # so alt text can contain the other quote type)
        alt_match = img_tag.match(/alt="([^"]*)"/i) || img_tag.match(/alt='([^']*)'/i)
        alt_text = alt_match ? CGI.escapeHTML(alt_match[1]) : ''

        # Add loading="lazy" if not present
        img_tag = img_tag.sub(/<img/i, '<img loading="lazy"') unless img_tag.match?(/loading=/i)

        # Add class="img" if not present
        if !img_tag.match?(/class=/i)
          img_tag = img_tag.sub(/<img/i, '<img class="img"')
        elsif !img_tag.match?(/class=["'][^"']*img[^"']*["']/i)
          img_tag = img_tag.sub(/class=["']([^"']*)["']/i, 'class="\1 img"')
        end

        <<~HTML
          <figure class="img-figure">
            <div class="img-wrapper" data-tooltip="#{alt_text}">
              #{img_tag}
            </div>
            <figcaption>#{alt_text}</figcaption>
          </figure>
        HTML
      end

      # Wrap video tags with figure and div
      content = content.gsub(%r{<video([^>]+)>(.*?)</video>}mi) do |match|
        video_tag = match

        <<~HTML
          <figure class="video-figure">
            <div class="video-wrapper">
              #{video_tag}
            </div>
          </figure>
        HTML
      end

      # Handle iframes (like YouTube embeds)
      content = content.gsub(%r{<iframe([^>]+)>(.*?)</iframe>}mi) do |match|
        iframe_tag = match

        # Check if it's a video iframe (YouTube, Vimeo, etc.)
        if iframe_tag.match?(/youtube|vimeo/i)
          <<~HTML
            <figure class="video-figure">
              <div class="video-wrapper">
                #{iframe_tag}
              </div>
            </figure>
          HTML
        else
          iframe_tag
        end
      end

      # Clean up any double-wrapped figures (in case content already has some figures)
      content = content.gsub(/<figure[^>]*>\s*<figure/mi, '<figure')
      content.gsub(%r{</figure>\s*</figure>}mi, '</figure>')
    end
  end
end

Liquid::Template.register_filter(Jekyll::MediaWrapper)
