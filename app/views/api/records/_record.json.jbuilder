json.(record, :id, :title, :image_url)

json.artist do
  json.id record.artist.id
  json.name record.artist.name
end
