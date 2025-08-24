require './utilities/apple_music_library_parser'

database_name = 'apple_music_stats.db'
db = AppleMusicLibraryParser::Database.new(database_name)
latest_export_id = db.get_all_exports.max_by { |e| e['export_date'] }.fetch('id')
puts db.get_all_exports.max_by { |e| e['export_date'] }
puts latest_export_id
puts db.get_top_artists_by_time(latest_export_id, 10)
puts db.get_top_albums_by_time(latest_export_id, 10)
