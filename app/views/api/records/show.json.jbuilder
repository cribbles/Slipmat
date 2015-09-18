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

json.artist do
  json.id @record.artist.id
  json.name @record.artist.name
end

if @record.label
  json.label do
    json.id @record.label.id
    json.title @record.label.title
  end
end

json.comments @record.comments do |comment|
  json.id comment.id
  json.author do
    json.id comment.author.id
    json.username comment.author.username
  end
  json.created_at comment.created_at
  json.body comment.body
end

json.contributors @record.contributors do |user|
  json.id user.id
  json.username user.username
end

json.in_collection @record.collected do |user|
  json.id user.id
  json.username user.username
end

json.in_wantlist @record.wanted do |user|
  json.id user.id
  json.username user.username
end
