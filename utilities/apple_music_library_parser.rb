require 'plist'

class AppleMusicLibraryParser
  Playlist = Struct.new(
    :all_items,
    :description,
    :distinguished_kind,
    :master,
    :music,
    :name,
    :playlist_id,
    :playlist_items,
    :playlist_persistent_id,
    :smart_criteria,
    :smart_info,
    :visible,
    :tracks_by_id,
    keyword_init: true
  ) do
    def tracks
      playlist_items.map { |item| tracks_by_id[item['Track ID']] }
    end
  end

  Track = Struct.new(
    :album,
    :album_artist,
    :album_loved,
    :album_rating,
    :album_rating_computed,
    :apple_music,
    :artist,
    :artwork_count,
    :bit_rate,
    :bpm,
    :clean,
    :comments,
    :compilation,
    :composer,
    :date_added,
    :date_modified,
    :disc_count,
    :disc_number,
    :explicit,
    :favorited,
    :file_folder_count,
    :genre,
    :grouping,
    :has_video,
    :hd,
    :kind,
    :library_folder_count,
    :location,
    :loved,
    :matched,
    :movement_count,
    :movement_name,
    :movement_number,
    :music_video,
    :name,
    :normalization,
    :part_of_gapless_album,
    :persistent_id,
    :play_count,
    :play_date,
    :play_date_utc,
    :playlist_only,
    :protected,
    :rating,
    :release_date,
    :sample_rate,
    :size,
    :skip_count,
    :skip_date,
    :sort_album,
    :sort_album_artist,
    :sort_artist,
    :sort_composer,
    :sort_name,
    :total_time,
    :track_count,
    :track_id,
    :track_number,
    :track_type,
    :work,
    :year,
    keyword_init: true
  )
  Album = Struct.new(
    :artist,
    :date_added,
    :genre,
    :loved,
    :name,
    :play_date_utc,
    :rating,
    :song_play_count,
    :year,
    :tracks,
    keyword_init: true
  )
  attr_reader :plist
  attr_reader :tracks
  attr_reader :playlists

  def initialize(library_xml_path)
    @plist = Plist.parse_xml(library_xml_path)
    @tracks ||= parse_tracks(plist['Tracks'])
    @tracks_by_id ||= tracks.map { |t| [t.track_id, t] }.to_h
    @playlists ||= parse_playlists(plist['Playlists'])
  end

  def top_played_tracks(limit: 10)
    tracks.sort_by { |t| t.play_count || 0 }.reverse.take(limit)
  end

  def top_played_albums(limit: 10)
    tracks.group_by(&:album).map do |album, tracks|
      parse_album(album, tracks)
    end.reject { |a| a.name.nil? }
      .sort_by(&:song_play_count).reverse.take(limit)
  end

  def smart_playlists
    playlists.select { |p| p.smart_criteria }
  end

  def recently_played
    playlists.find { |p| p.name == 'Recently Played' }
  end

  def recently_added
    playlists.find { |p| p.name == 'Recently Added' }
  end

  def top_rated
    playlists.find { |p| p.name == 'My Top Rated' }
  end

  def loved_tracks
    tracks.select(&:loved)
  end

  # this is the same as loved_tracks, but I'm keeping it for backwards compatibility
  def favorited_tracks
    tracks.select(&:favorited)
  end

  def loved_albums
    tracks.select(&:album_loved).group_by(&:album).map do |album, tracks|
      parse_album(album, tracks)
    end
  end

  private

  def parse_album(album, tracks)
    Album.new(
      artist: tracks.first.artist,
      date_added: tracks.min_by { |t| t.date_added || DateTime.now }.date_added,
      genre: tracks.first.genre,
      loved: tracks.first.album_loved,
      name: album,
      play_date_utc: tracks.max_by { |t| t.play_date_utc || DateTime.new }.play_date_utc,
      rating: tracks.first.album_rating,
      song_play_count: tracks.sum { |t| t.play_count || 0 },
      year: tracks.first.year,
      tracks: tracks
    )
  end

  def parse_playlists(array)
    array.map do |playlist_dict|
      dict = parse_dict(playlist_dict)
      dict[:tracks_by_id] = @tracks_by_id
      Playlist.new(dict)
    end
  end

  def parse_tracks(dict)
    dict.values.map do |track_dict|
      Track.new(parse_dict(track_dict))
    end
  end

  def parse_key(key)
    key.downcase.gsub(/\s+/, '_').to_sym
  end

  def parse_dict(track_dict)
    track_dict.transform_keys(&method(:parse_key))
  end
end
