json.extract!(
  @record,
  :id,
  :title,
  :cat_no,
  :year,
  :image_url,
  :notes,
  :created_at,
  :updated_at
)

if @record.artist
  json.artist do
    json.id @record.artist.id
    json.name @record.artist.name
  end
end

if @record.label
  json.label do
    json.id @record.label.id
    json.title @record.label.title
  end
end
