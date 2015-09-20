json.extract!(
  @record,
  :id,
  :title,
  :cat_no,
  :year,
  :notes,
  :created_at,
  :updated_at
)

json.artist do
  json.id @record.artist.id
  json.name @record.artist.name
end

json.image asset_path(@record.image.url)

if @record.tracks
  json.tracks(
    @record.tracks,
    partial: 'api/tracks/track',
    as: :track
  )
end

if @record.label
  json.label do
    json.id @record.label.id
    json.title @record.label.title
  end
end

if @record.country
  json.country do
    json.id @record.country.id
    json.name @record.country.name
  end
end

json.comments(
  @record.comments.reverse,
  partial: 'api/comments/comment',
  as: :comment
)

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
