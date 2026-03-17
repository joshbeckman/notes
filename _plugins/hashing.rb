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

    # Returns a full CSS background property using repeating gradients.
    # Uses var(--c-josh) so it respects theme changes.
    def pattern_css(input)
      hash = Digest::MD5.hexdigest(input.to_s)
      bytes = hash.chars.each_slice(2).map { |pair| pair.join.to_i(16) }

      pattern_type = bytes[0] % 6
      angle = (bytes[1] * 180.0 / 255).round
      spacing = (bytes[2] % 13) + 8    # 8..20px
      stroke_w = (bytes[3] % 2) + 1    # 1..2px
      c = 'var(--c-josh)'

      case pattern_type
      when 0 # diagonal lines
        "background-image: repeating-linear-gradient(#{angle}deg, #{c} 0px, #{c} #{stroke_w}px, transparent #{stroke_w}px, transparent #{spacing}px)"
      when 1 # cross-hatch
        "background-image: repeating-linear-gradient(#{angle}deg, #{c} 0px, #{c} #{stroke_w}px, transparent #{stroke_w}px, transparent #{spacing}px), " \
        "repeating-linear-gradient(#{(angle + 90) % 360}deg, #{c} 0px, #{c} #{stroke_w}px, transparent #{stroke_w}px, transparent #{spacing}px)"
      when 2 # dots
        r = stroke_w + 1
        "background: radial-gradient(circle #{r}px, #{c} 99%, transparent 100%) 0 0 / #{spacing}px #{spacing}px"
      when 3 # zigzag (alternating stripe pairs)
        half = spacing / 2
        "background-image: repeating-linear-gradient(#{angle}deg, #{c} 0px, #{c} #{stroke_w}px, transparent #{stroke_w}px, transparent #{half}px, #{c} #{half}px, #{c} #{half + stroke_w}px, transparent #{half + stroke_w}px, transparent #{spacing}px)"
      when 4 # triple-line grid
        "background-image: repeating-linear-gradient(#{angle}deg, #{c} 0px, #{c} #{stroke_w}px, transparent #{stroke_w}px, transparent #{spacing}px), " \
        "repeating-linear-gradient(#{(angle + 60) % 360}deg, #{c} 0px, #{c} #{stroke_w}px, transparent #{stroke_w}px, transparent #{spacing}px), " \
        "repeating-linear-gradient(#{(angle + 120) % 360}deg, #{c} 0px, #{c} #{stroke_w}px, transparent #{stroke_w}px, transparent #{spacing}px)"
      when 5 # checkerboard
        "background: repeating-conic-gradient(#{c} 0% 25%, transparent 0% 50%) 0 0 / #{spacing}px #{spacing}px"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::HashingFilter)
