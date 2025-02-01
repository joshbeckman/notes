# frozen_string_literal: true
Artist = Struct.new(
  :name,
  :play_date_utc,
  :song_play_count,
  :song_play_ratio,
  :top_played_album,
  :top_played_tracks,
  :loved,
  keyword_init: true
)
