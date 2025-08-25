# frozen_string_literal: true

require 'sqlite3'
require 'date'

# Database adapter for storing and analyzing Apple Music library statistics over time
#
# Method Naming Convention:
# - get_all_*         : Returns all records (e.g., get_all_exports)
# - get_played_*      : Returns items played between exports, sorted by plays added
# - get_top_*_by_*    : Returns top N items sorted by specific metric (plays or time)
# - get_*_summary     : Returns aggregate statistics
# - get_*_history     : Returns historical data for a specific item
# - calculate_*       : Performs calculations and returns computed values
#
# Example usage:
#   db = AppleMusicLibraryParser::Database.new('apple_music_stats.db')
#
#   # Get all tracks played since last export
#   tracks = db.get_played_tracks(export_id)
#
#   # Get top 10 artists by listening time
#   artists = db.get_top_artists_by_time(export_id, 10)
#
#   # Get listening summary for the period
#   summary = db.get_listening_summary(export_id)
#
class AppleMusicLibraryParser
  class Database
    attr_reader :db

    def initialize(db_path = 'apple_music_stats.db')
      @db = SQLite3::Database.new(db_path)
      @db.results_as_hash = true
      setup_schema
    end

    def setup_schema
      @db.execute_batch <<-SQL
        CREATE TABLE IF NOT EXISTS tracks (
          persistent_id TEXT PRIMARY KEY,
          track_id INTEGER,
          name TEXT,
          artist TEXT,
          album TEXT,
          album_artist TEXT,
          genre TEXT,
          year INTEGER,
          total_time INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS library_exports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          export_date DATETIME NOT NULL,
          library_persistent_id TEXT,
          total_tracks INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS track_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          persistent_id TEXT NOT NULL,
          export_id INTEGER NOT NULL,
          play_count INTEGER,
          play_date_utc DATETIME,
          skip_count INTEGER,
          skip_date DATETIME,
          rating INTEGER,
          loved BOOLEAN,
          date_added DATETIME,
          date_modified DATETIME,
          FOREIGN KEY (persistent_id) REFERENCES tracks(persistent_id),
          FOREIGN KEY (export_id) REFERENCES library_exports(id),
          UNIQUE(persistent_id, export_id)
        );

        CREATE INDEX IF NOT EXISTS idx_track_stats_persistent_id ON track_stats(persistent_id);
        CREATE INDEX IF NOT EXISTS idx_track_stats_export_id ON track_stats(export_id);
        CREATE INDEX IF NOT EXISTS idx_track_stats_play_date ON track_stats(play_date_utc);
        CREATE INDEX IF NOT EXISTS idx_library_exports_date ON library_exports(export_date);
      SQL
    end

    def save_library_export(library_persistent_id, total_tracks, export_date = DateTime.now)
      @db.execute(
        'INSERT INTO library_exports (library_persistent_id, total_tracks, export_date) VALUES (?, ?, ?)',
        [library_persistent_id, total_tracks, export_date.to_s]
      )
      @db.last_insert_row_id
    end

    def save_track(track)
      @db.execute(<<-SQL, [track.persistent_id,
        INSERT OR REPLACE INTO tracks (
          persistent_id, track_id, name, artist, album, album_artist,#{' '}
          genre, year, total_time, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      SQL
                  track.track_id,
                  track.name,
                  track.artist,
                  track.album,
                  track.album_artist,
                  track.genre,
                  track.year,
                  track.total_time])
    end

    def save_track_stats(track, export_id)
      @db.execute(<<-SQL, [track.persistent_id,
        INSERT OR REPLACE INTO track_stats (
          persistent_id, export_id, play_count, play_date_utc,#{' '}
          skip_count, skip_date, rating, loved, date_added, date_modified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      SQL
                  export_id,
                  track.play_count,
                  track.play_date_utc&.to_s,
                  track.skip_count,
                  track.skip_date&.to_s,
                  track.rating,
                  track.loved ? 1 : 0,
                  track.date_added&.to_s,
                  track.date_modified&.to_s])
    end

    def get_previous_stats(persistent_id, before_export_id = nil)
      query = if before_export_id
                <<-SQL
                  SELECT ts.*, le.export_date#{' '}
                  FROM track_stats ts
                  JOIN library_exports le ON ts.export_id = le.id
                  WHERE ts.persistent_id = ? AND ts.export_id < ?
                  ORDER BY ts.export_id DESC
                  LIMIT 1
                SQL
              else
                <<-SQL
                  SELECT ts.*, le.export_date#{' '}
                  FROM track_stats ts
                  JOIN library_exports le ON ts.export_id = le.id
                  WHERE ts.persistent_id = ?
                  ORDER BY ts.export_id DESC
                  LIMIT 1
                SQL
              end

      args = before_export_id ? [persistent_id, before_export_id] : [persistent_id]
      @db.get_first_row(query, args)
    end

    def calculate_play_delta(persistent_id, export_id)
      current = @db.get_first_row(<<-SQL, [persistent_id, export_id])
        SELECT ts.*, le.export_date#{' '}
        FROM track_stats ts
        JOIN library_exports le ON ts.export_id = le.id
        WHERE ts.persistent_id = ? AND ts.export_id = ?
      SQL

      previous = get_previous_stats(persistent_id, export_id)

      return nil unless current && previous

      {
        persistent_id: persistent_id,
        play_count_delta: (current['play_count'] || 0) - (previous['play_count'] || 0),
        skip_count_delta: (current['skip_count'] || 0) - (previous['skip_count'] || 0),
        rating_changed: current['rating'] != previous['rating'],
        loved_changed: current['loved'] != previous['loved'],
        days_between_exports: days_between(previous['export_date'], current['export_date'])
      }
    end

    def get_listening_history(persistent_id)
      @db.execute(<<-SQL, persistent_id)
        SELECT#{' '}
          ts.*,
          le.export_date,
          LAG(ts.play_count) OVER (ORDER BY le.export_date) as prev_play_count,
          LAG(ts.skip_count) OVER (ORDER BY le.export_date) as prev_skip_count
        FROM track_stats ts
        JOIN library_exports le ON ts.export_id = le.id
        WHERE ts.persistent_id = ?
        ORDER BY le.export_date
      SQL
    end

    # Returns all tracks played between exports, sorted by plays added (descending)
    def get_played_tracks(export_id)
      @db.execute(<<-SQL, [export_id, export_id])
        SELECT#{' '}
          t.*,
          ts.play_count as current_play_count,
          COALESCE(prev.play_count, 0) as previous_play_count,
          (ts.play_count - COALESCE(prev.play_count, 0)) as plays_added
        FROM track_stats ts
        JOIN tracks t ON ts.persistent_id = t.persistent_id
        LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
          AND prev.export_id = (
            SELECT MAX(export_id)#{' '}
            FROM track_stats#{' '}
            WHERE persistent_id = ts.persistent_id AND export_id < ?
          )
        WHERE ts.export_id = ?
          AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
        ORDER BY plays_added DESC
      SQL
    end

    def get_export_summary(export_id)
      @db.get_first_row(<<-SQL, export_id)
        SELECT#{' '}
          le.*,
          COUNT(DISTINCT ts.persistent_id) as total_tracks,
          SUM(ts.play_count) as total_plays,
          SUM(ts.skip_count) as total_skips,
          COUNT(CASE WHEN ts.loved = 1 THEN 1 END) as loved_tracks
        FROM library_exports le
        LEFT JOIN track_stats ts ON le.id = ts.export_id
        WHERE le.id = ?
        GROUP BY le.id
      SQL
    end

    def get_all_exports
      @db.execute(<<-SQL)
        SELECT#{' '}
          le.*,
          COUNT(DISTINCT ts.persistent_id) as track_count
        FROM library_exports le
        LEFT JOIN track_stats ts ON le.id = ts.export_id
        GROUP BY le.id
        ORDER BY le.export_date DESC
      SQL
    end

    # Check if an export already exists for the given date
    def export_exists_for_date?(export_date)
      result = @db.get_first_value(
        'SELECT COUNT(*) FROM library_exports WHERE DATE(export_date) = DATE(?)',
        export_date.to_s
      )
      result > 0
    end

    # Get export by date
    def get_export_by_date(export_date)
      @db.get_first_row(
        'SELECT * FROM library_exports WHERE DATE(export_date) = DATE(?)',
        export_date.to_s
      )
    end

    # Returns all artists with plays between exports, sorted by plays added (descending)
    def get_played_artists(export_id)
      @db.execute(<<-SQL, [export_id, export_id])
        SELECT#{' '}
          t.artist,
          COUNT(DISTINCT t.persistent_id) as track_count,
          SUM(ts.play_count - COALESCE(prev.play_count, 0)) as total_plays_added,
          SUM(ts.play_count) as current_total_plays,
          SUM(COALESCE(prev.play_count, 0)) as previous_total_plays
        FROM track_stats ts
        JOIN tracks t ON ts.persistent_id = t.persistent_id
        LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
          AND prev.export_id = (
            SELECT MAX(export_id)#{' '}
            FROM track_stats#{' '}
            WHERE persistent_id = ts.persistent_id AND export_id < ?
          )
        WHERE ts.export_id = ?
          AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
        GROUP BY t.artist
        HAVING total_plays_added > 0
        ORDER BY total_plays_added DESC
      SQL
    end

    # Returns all albums with plays between exports, sorted by plays added (descending)
    def get_played_albums(export_id)
      @db.execute(<<-SQL, [export_id, export_id])
        SELECT#{' '}
          t.album,
          t.artist,
          t.album_artist,
          COUNT(DISTINCT t.persistent_id) as track_count,
          SUM(ts.play_count - COALESCE(prev.play_count, 0)) as total_plays_added,
          SUM(ts.play_count) as current_total_plays,
          SUM(COALESCE(prev.play_count, 0)) as previous_total_plays,
          MAX(t.year) as year,
          MAX(t.genre) as genre
        FROM track_stats ts
        JOIN tracks t ON ts.persistent_id = t.persistent_id
        LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
          AND prev.export_id = (
            SELECT MAX(export_id)#{' '}
            FROM track_stats#{' '}
            WHERE persistent_id = ts.persistent_id AND export_id < ?
          )
        WHERE ts.export_id = ?
          AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
        GROUP BY t.album, t.artist
        HAVING total_plays_added > 0
        ORDER BY total_plays_added DESC
      SQL
    end

    # Returns top N artists by play count for the period
    def get_top_artists_by_plays(export_id, limit = 20)
      @db.execute(<<-SQL, [export_id, limit])
        SELECT#{' '}
          artist,
          track_count,
          total_plays_added,
          ROUND(total_plays_added * 1.0 / track_count, 2) as avg_plays_per_track
        FROM (
          SELECT#{' '}
            t.artist,
            COUNT(DISTINCT t.persistent_id) as track_count,
            SUM(ts.play_count - COALESCE(prev.play_count, 0)) as total_plays_added
          FROM track_stats ts
          JOIN tracks t ON ts.persistent_id = t.persistent_id
          LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
            AND prev.export_id = (
              SELECT MAX(export_id)#{' '}
              FROM track_stats#{' '}
              WHERE persistent_id = ts.persistent_id AND export_id < ts.export_id
            )
          WHERE ts.export_id = ?
            AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
          GROUP BY t.artist
        )
        WHERE total_plays_added > 0
        ORDER BY total_plays_added DESC
        LIMIT ?
      SQL
    end

    # Returns top N albums by play count for the period
    def get_top_albums_by_plays(export_id, limit = 20)
      @db.execute(<<-SQL, [export_id, limit])
        SELECT#{' '}
          album,
          artist,
          track_count,
          total_plays_added,
          year,
          genre,
          ROUND(total_plays_added * 1.0 / track_count, 2) as avg_plays_per_track
        FROM (
          SELECT#{' '}
            t.album,
            t.artist,
            COUNT(DISTINCT t.persistent_id) as track_count,
            SUM(ts.play_count - COALESCE(prev.play_count, 0)) as total_plays_added,
            MAX(t.year) as year,
            MAX(t.genre) as genre
          FROM track_stats ts
          JOIN tracks t ON ts.persistent_id = t.persistent_id
          LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
            AND prev.export_id = (
              SELECT MAX(export_id)#{' '}
              FROM track_stats#{' '}
              WHERE persistent_id = ts.persistent_id AND export_id < ts.export_id
            )
          WHERE ts.export_id = ?
            AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
          GROUP BY t.album, t.artist
        )
        WHERE total_plays_added > 0
        ORDER BY total_plays_added DESC
        LIMIT ?
      SQL
    end

    # Returns summary statistics for listening time between exports
    def get_listening_summary(export_id)
      current = @db.get_first_row(<<-SQL, [export_id, export_id])
        SELECT#{' '}
          COUNT(DISTINCT t.persistent_id) as tracks_played,
          SUM(ts.play_count - COALESCE(prev.play_count, 0)) as total_plays,
          ROUND(SUM((ts.play_count - COALESCE(prev.play_count, 0)) * t.total_time) / 1000.0 / 60.0, 2) as total_minutes,
          ROUND(SUM((ts.play_count - COALESCE(prev.play_count, 0)) * t.total_time) / 1000.0 / 60.0 / 60.0, 2) as total_hours
        FROM track_stats ts
        JOIN tracks t ON ts.persistent_id = t.persistent_id
        LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
          AND prev.export_id = (
            SELECT MAX(export_id)#{' '}
            FROM track_stats#{' '}
            WHERE persistent_id = ts.persistent_id AND export_id < ?
          )
        WHERE ts.export_id = ?
          AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
      SQL

      current || {}
    end

    # Returns tracks sorted by minutes played (descending), optionally limited
    def get_top_tracks_by_time(export_id, limit = nil)
      query = <<-SQL
        SELECT#{' '}
          t.*,
          ts.play_count as current_play_count,
          COALESCE(prev.play_count, 0) as previous_play_count,
          (ts.play_count - COALESCE(prev.play_count, 0)) as plays_added,
          ROUND((ts.play_count - COALESCE(prev.play_count, 0)) * t.total_time / 1000.0 / 60.0, 2) as minutes_played
        FROM track_stats ts
        JOIN tracks t ON ts.persistent_id = t.persistent_id
        LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
          AND prev.export_id = (
            SELECT MAX(export_id)#{' '}
            FROM track_stats#{' '}
            WHERE persistent_id = ts.persistent_id AND export_id < ?
          )
        WHERE ts.export_id = ?
          AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
        ORDER BY minutes_played DESC
      SQL

      query += ' LIMIT ?' if limit
      args = limit ? [export_id, export_id, limit] : [export_id, export_id]

      @db.execute(query, args)
    end

    # Returns artists sorted by total minutes played (descending), optionally limited
    def get_top_artists_by_time(export_id, limit = nil)
      query = <<-SQL
        SELECT#{' '}
          t.artist,
          COUNT(DISTINCT t.persistent_id) as track_count,
          SUM(ts.play_count - COALESCE(prev.play_count, 0)) as total_plays_added,
          ROUND(SUM((ts.play_count - COALESCE(prev.play_count, 0)) * t.total_time) / 1000.0 / 60.0, 2) as total_minutes_played,
          ROUND(SUM((ts.play_count - COALESCE(prev.play_count, 0)) * t.total_time) / 1000.0 / 60.0 / 60.0, 2) as total_hours_played
        FROM track_stats ts
        JOIN tracks t ON ts.persistent_id = t.persistent_id
        LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
          AND prev.export_id = (
            SELECT MAX(export_id)#{' '}
            FROM track_stats#{' '}
            WHERE persistent_id = ts.persistent_id AND export_id < ?
          )
        WHERE ts.export_id = ?
          AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
        GROUP BY t.artist
        HAVING total_plays_added > 0
        ORDER BY total_minutes_played DESC
      SQL

      query += ' LIMIT ?' if limit
      args = limit ? [export_id, export_id, limit] : [export_id, export_id]

      @db.execute(query, args)
    end

    # Returns albums sorted by total minutes played (descending), optionally limited
    def get_top_albums_by_time(export_id, limit = nil)
      query = <<-SQL
        SELECT#{' '}
          t.album,
          t.artist,
          t.album_artist,
          COUNT(DISTINCT t.persistent_id) as track_count,
          SUM(ts.play_count - COALESCE(prev.play_count, 0)) as total_plays_added,
          ROUND(SUM((ts.play_count - COALESCE(prev.play_count, 0)) * t.total_time) / 1000.0 / 60.0, 2) as total_minutes_played,
          ROUND(SUM((ts.play_count - COALESCE(prev.play_count, 0)) * t.total_time) / 1000.0 / 60.0 / 60.0, 2) as total_hours_played,
          MAX(t.year) as year,
          MAX(t.genre) as genre
        FROM track_stats ts
        JOIN tracks t ON ts.persistent_id = t.persistent_id
        LEFT JOIN track_stats prev ON prev.persistent_id = ts.persistent_id
          AND prev.export_id = (
            SELECT MAX(export_id)#{' '}
            FROM track_stats#{' '}
            WHERE persistent_id = ts.persistent_id AND export_id < ?
          )
        WHERE ts.export_id = ?
          AND (prev.play_count IS NULL OR ts.play_count > prev.play_count)
        GROUP BY t.album, t.artist
        HAVING total_plays_added > 0
        ORDER BY total_minutes_played DESC
      SQL

      query += ' LIMIT ?' if limit
      args = limit ? [export_id, export_id, limit] : [export_id, export_id]

      @db.execute(query, args)
    end

    # Deletes an export and all associated track stats
    # Returns the number of track stats deleted
    def delete_export(export_id)
      # First get the export info for confirmation
      export = get_export_summary(export_id)
      return 0 unless export
      
      # Delete track stats first (foreign key constraint)
      @db.execute('DELETE FROM track_stats WHERE export_id = ?', export_id)
      deleted_stats = @db.changes
      
      # Delete the export record
      @db.execute('DELETE FROM library_exports WHERE id = ?', export_id)
      
      # Clean up orphaned tracks (tracks with no stats)
      @db.execute(<<-SQL)
        DELETE FROM tracks 
        WHERE persistent_id NOT IN (
          SELECT DISTINCT persistent_id FROM track_stats
        )
      SQL
      
      deleted_stats
    end

    # Deletes multiple exports at once
    # Returns total number of track stats deleted
    def delete_exports(export_ids)
      return 0 if export_ids.empty?
      
      total_deleted = 0
      @db.transaction do
        export_ids.each do |export_id|
          total_deleted += delete_export(export_id)
        end
      end
      
      total_deleted
    end

    def close
      @db.close
    end

    private

    def days_between(date1_str, date2_str)
      return nil unless date1_str && date2_str

      date1 = DateTime.parse(date1_str)
      date2 = DateTime.parse(date2_str)
      (date2 - date1).to_i
    end
  end
end
