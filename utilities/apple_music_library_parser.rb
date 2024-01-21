require 'plist'
require_relative 'apple_music_library_parser/album'
require_relative 'apple_music_library_parser/artist'
require_relative 'apple_music_library_parser/playlist'
require_relative 'apple_music_library_parser/track'

class AppleMusicLibraryParser
  attr_reader :plist
  attr_reader :tracks
  attr_reader :playlists

  def initialize(library_xml_path)
    @plist = Plist.parse_xml(library_xml_path)
    @tracks ||= parse_tracks(plist['Tracks'])
    @tracks_by_id ||= tracks.map { |t| [t.track_id, t] }.to_h
    @playlists ||= parse_playlists(plist['Playlists'])
    @artists ||= tracks.group_by(&:artist).map do |artist, tracks|
      parse_artist(artist, tracks)
    end.reject { |a| a.name.nil? }
    @albums ||= tracks.group_by(&:album).map do |album, tracks|
      parse_album(album, tracks)
    end.reject { |a| a.name.nil? }
  end

  def top_played_tracks(limit: 10)
    @tracks.sort_by { |t| t.play_count || 0 }.reverse.take(limit)
  end

  def top_played_albums(limit: 10, include_ep: false, sort_by: :song_play_ratio)
    @albums.select { |a| include_ep || a.tracks.count > 3 }
      .sort_by(&sort_by).reverse.take(limit)
  end

  def top_played_artists(limit: 10, sort_by: :song_play_count)
    @artists.sort_by(&sort_by).reverse.take(limit)
  end

  def smart_playlists
    @playlists.select { |p| p.smart_criteria }
  end

  def recently_played_playlist
    @playlists.find { |p| p.name == 'Recently Played' }
  end

  def recently_added_playlist
    @playlists.find { |p| p.name == 'Recently Added' }
  end

  def top_rated_playlist
    @playlists.find { |p| p.name == 'My Top Rated' }
  end

  def loved_tracks
    @tracks.select(&:loved)
  end

  # this is the same as loved_tracks, but I'm keeping it for backwards compatibility
  def favorited_tracks
    @tracks.select(&:favorited)
  end

  def loved_albums
    @albums.select(&:loved)
  end

  def loved_artists
    @artists.select(&:loved)
  end

  def recently_played_albums
    recently_played_playlist.tracks.group_by(&:album).map do |album, tracks|
      parse_album(album, tracks)
    end
  end

  def forgotten_loved_tracks(limit: 10)
    loved_tracks.sort_by { |t| t.play_date_utc || DateTime.new }.take(limit)
  end

  private

  def parse_artist(artist, tracks)
    albums = tracks.group_by(&:album).map do |album, tracks|
      parse_album(album, tracks)
    end
    Artist.new(
      name: artist,
      loved: tracks.any?(&:loved),
      play_date_utc: tracks.max_by { |t| t.play_date_utc || DateTime.new }.play_date_utc,
      song_play_count: tracks.sum { |t| t.play_count || 0 },
      song_play_ratio: tracks.sum { |t| t.play_count || 0 } / tracks.count.to_f,
      top_played_tracks: tracks.sort_by { |t| t.play_count || 0 }.reverse.take(5),
      top_played_album: albums.sort_by(&:song_play_count).reverse.first
    )
  end

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
      song_play_ratio: tracks.sum { |t| t.play_count || 0 } / tracks.count.to_f,
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
