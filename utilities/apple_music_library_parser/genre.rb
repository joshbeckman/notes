# frozen_string_literal: true

Genre = Struct.new(
  :name,
  :play_count,
  :total_time,
  :track_count,
  keyword_init: true
)
