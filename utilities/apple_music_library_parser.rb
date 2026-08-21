# frozen_string_literal: true

require 'plist'
require_relative 'apple_music_library_parser/album'
require_relative 'apple_music_library_parser/artist'
require_relative 'apple_music_library_parser/playlist'
require_relative 'apple_music_library_parser/track'
require_relative 'apple_music_library_parser/genre'
require_relative 'apple_music_library_parser/database'

class AppleMusicLibraryParser
  attr_reader :plist, :tracks, :playlists

  def initialize(library_xml_path)
    @plist = Plist.parse_xml(library_xml_path)
    all_tracks = parse_tracks(plist['Tracks'])
    # Playlist-only entries are catalog tracks referenced by playlists, not
    # library members; playlists still need to resolve them by ID, but they
    # would silently inflate every library-wide stat.
    @tracks_by_id = all_tracks.to_h { |t| [t.track_id, t] }
    @tracks = all_tracks.reject(&:playlist_only)
    @playlists = parse_playlists(plist['Playlists'])
    @artists = tracks.group_by(&:artist).map do |artist, tracks|
      parse_artist(artist, tracks)
    end.reject { |a| a.name.nil? || a.name.strip == '' }
    # Keyed by [album artist, album name] because bare album names collide
    # across artists (ten different "Greatest Hits").
    @albums_by_key = tracks.group_by { |t| album_key(t) }
                           .reject { |key, _| key.last.nil? || key.last.strip == '' }
                           .transform_values { |ts| parse_album(ts) }
    @albums = @albums_by_key.values
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

  def top_genres(limit: 10, sort_by: :track_count)
    @tracks.group_by(&:genre).map do |genre, tracks|
      Genre.new(
        name: genre,
        play_count: tracks.sum { |t| t.play_count || 0 },
        total_time: tracks.sum { |t| t.total_time || 0 },
        track_count: tracks.count
      )
    end.sort_by(&sort_by).reverse.take(limit)
  end

  def smart_playlists
    @playlists.select(&:smart_criteria)
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

  def recently_loved_tracks(limit: 10)
    loved_tracks.sort_by { |t| t.date_added || DateTime.now }.reverse.take(limit)
  end

  def recently_loved_albums(limit: 10)
    loved_tracks.sort_by { |t| t.date_added || DateTime.now }
                .reverse
                .map { |t| album_key(t) }
                .uniq
                .take(limit)
                .map { |key| @albums_by_key[key] }
                .compact
  end

  def recently_played_albums(limit: 10)
    recently_played_playlist.tracks.group_by { |t| album_key(t) }.map do |_, tracks|
      parse_album(tracks)
    end.sort_by { |a| a.play_date_utc || DateTime.new }.reverse.take(limit)
  end

  # Favoriting from the Apple Music catalog can create a second, zero-play
  # media item for a track already in the library, and plays on other devices
  # don't reliably sync a local play count. Deduping by artist+name (keeping
  # the most-played copy) and requiring a real play date keeps both kinds of
  # phantom "never played" rows out of the list.
  def forgotten_loved_tracks(limit: 10)
    loved_keys = loved_tracks.map { |t| [t.artist, t.name] }.uniq
    @tracks.group_by { |t| [t.artist, t.name] }
           .values_at(*loved_keys)
           .map { |dupes| dupes.max_by { |t| t.play_count || 0 } }
           .select { |t| t.play_date_utc && (t.play_count || 0).positive? }
           .sort_by(&:play_date_utc)
           .take(limit)
  end

  def tracks_added_by_year
    @tracks.reject { |t| t.date_added.nil? }
           .group_by { |t| t.date_added.year }
           .transform_values(&:count)
           .sort.to_h
  end

  def top_genres_by_added_year(top: 3)
    @tracks.reject { |t| t.date_added.nil? || t.genre.nil? || t.genre.strip.empty? }
           .group_by { |t| t.date_added.year }
           .sort
           .map do |year, tracks|
      genres = tracks.group_by(&:genre)
                     .map { |genre, ts| [genre, ts.count] }
                     .sort_by { |_, count| -count }
                     .take(top)
      [year, genres]
    end
  end

  def tracks_by_release_decade
    @tracks.select { |t| t.year&.positive? }
           .group_by { |t| (t.year / 10) * 10 }
           .sort
           .map do |decade, ts|
      [decade, { count: ts.count, plays: ts.sum { |t| t.play_count || 0 } }]
    end
  end

  def play_concentration
    counts = @tracks.map { |t| t.play_count || 0 }.sort.reverse
    total = counts.sum
    share = lambda do |pct|
      counts.take((counts.size * pct).ceil).sum * 100.0 / total
    end
    {
      total_plays: total,
      top_1_pct: share.call(0.01),
      top_5_pct: share.call(0.05),
      top_10_pct: share.call(0.10)
    }
  end

  def never_played
    count = @tracks.count { |t| (t.play_count || 0).zero? }
    { count: count, pct: count * 100.0 / @tracks.count }
  end

  # An artist where one track soaks up most of their plays. min_tracks and
  # min_plays filter out artists I barely know, which would otherwise all
  # score 100% and make the list meaningless.
  def one_hit_wonders(limit: 10, min_tracks: 5, min_plays: 100)
    @tracks.group_by(&:artist).filter_map do |artist, ts|
      next if artist.nil? || artist.strip.empty? || ts.count < min_tracks

      total = ts.sum { |t| t.play_count || 0 }
      next if total < min_plays

      top = ts.max_by { |t| t.play_count || 0 }
      {
        artist: artist,
        track: top.name,
        track_plays: top.play_count || 0,
        total_plays: total,
        share: (top.play_count || 0) * 100.0 / total
      }
    end.sort_by { |h| -h[:share] }.take(limit)
  end

  # Coefficient of variation of per-track plays within an album: low means I
  # play it front-to-back, high means I cherry-pick. min_mean_plays keeps
  # barely-played albums (where CV is mostly noise) out of both lists.
  def album_loyalty(limit: 5, min_tracks: 4, min_mean_plays: 5)
    scored = @albums.filter_map do |album|
      counts = album.tracks.map { |t| t.play_count || 0 }
      next if counts.size < min_tracks

      mean = counts.sum.to_f / counts.size
      next if mean < min_mean_plays

      stddev = Math.sqrt(counts.sum { |c| (c - mean)**2 } / counts.size)
      [album, stddev / mean]
    end
    {
      front_to_back: scored.sort_by { |_, cv| cv }.take(limit),
      cherry_picked: scored.sort_by { |_, cv| -cv }.take(limit)
    }
  end

  def save_to_database(db_path = 'apple_music_stats.db', export_date = DateTime.now)
    db = Database.new(db_path)

    if db.export_exists_for_date?(export_date)
      existing_export = db.get_export_by_date(export_date)
      puts "Export already exists for #{export_date.strftime('%Y-%m-%d')} (ID: #{existing_export['id']}), skipping duplicate save"
      return existing_export['id']
    end

    library_id = @plist['Library Persistent ID']
    export_id = db.save_library_export(library_id, @tracks.count, export_date)

    @tracks.each do |track|
      next unless track.persistent_id

      db.save_track(track)
      db.save_track_stats(track, export_id)
    end

    export_id
  ensure
    db&.close
  end

  def get_listening_deltas(db_path = 'apple_music_stats.db', export_id = nil)
    db = Database.new(db_path)

    export_id ||= db.get_all_exports.first['id'] if db.get_all_exports.any?
    return [] unless export_id

    db.get_played_tracks(export_id)
  ensure
    db&.close
  end

  def get_track_history(persistent_id, db_path = 'apple_music_stats.db')
    db = Database.new(db_path)
    db.get_listening_history(persistent_id)
  ensure
    db&.close
  end

  def get_export_summaries(db_path = 'apple_music_stats.db')
    db = Database.new(db_path)
    db.get_all_exports
  ensure
    db&.close
  end

  private

  def album_key(track)
    [track.album_artist || track.artist, track.album]
  end

  def parse_artist(artist, tracks)
    albums = tracks.group_by { |t| album_key(t) }.map do |_, tracks|
      parse_album(tracks)
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

  def parse_album(tracks)
    Album.new(
      artist: tracks.first.album_artist || tracks.first.artist,
      date_added: tracks.min_by { |t| t.date_added || DateTime.now }.date_added,
      genre: tracks.first.genre,
      loved: tracks.first.album_loved,
      name: tracks.first.album,
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
