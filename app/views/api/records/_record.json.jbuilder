json.(record, :id, :title)

json.artist do
  json.id record.try(:a_id) || record.artist.id
  json.name record.try(:a_name) || record.artist.name
end

json.image asset_path(record.image.url)
