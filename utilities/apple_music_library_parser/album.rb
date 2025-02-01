# frozen_string_literal: true

Album = Struct.new(
  :artist,
  :date_added,
  :genre,
  :loved,
  :name,
  :play_date_utc,
  :rating,
  :song_play_count,
  :song_play_ratio,
  :tracks,
  :year,
  keyword_init: true
) do
  def to_s
    "#{artist} - #{name} (#{year})"
  end

  # Use the `sacad` CLI, if present, to download album art.
  def download_album_art
    if File.exist?(album_art_asset)
      puts "Album art already exists for #{artist} - #{name}."
      return
    end
    sacad = `which sacad`.strip
    unless sacad.length.positive?
      puts 'sacad CLI not found. Please install it to download album art.'
      return
    end

    system("#{sacad} \"#{artist}\" \"#{name}\" 500 \"#{album_art_asset}\"")
  end

  def album_art_md
    return "![#{artist} - #{name}](/#{album_art_asset})" if File.exist?(album_art_asset)

    ''
  end

  def album_art_asset
    artist_slug = artist&.downcase&.gsub(/[^a-z0-9]/, '')
    name_slug = name&.downcase&.gsub(/[^a-z0-9]/, '')
    "assets/images/album_art/#{artist_slug}-#{name_slug}.jpg"
  end
end
