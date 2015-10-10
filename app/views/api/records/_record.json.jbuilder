json.(record, :id, :title)
json.list_id record.list_id if record.try(:list_id)

json.artist do
  json.id record.try(:a_id) || record.artist.id
  json.name record.try(:a_name) || record.artist.name
end

json.image asset_path(record.image.url)
