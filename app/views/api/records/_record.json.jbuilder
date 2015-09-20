json.(record, :id, :title)

json.artist do
  json.id record.artist.id
  json.name record.artist.name
end

json.image asset_path(record.image.url)
