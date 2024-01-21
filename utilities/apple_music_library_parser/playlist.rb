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
