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

json.genres @record.genres, partial: "api/genres/genre", as: :genre

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

json.num_collected @record.user_collections_count
json.num_wanted @record.user_wants_count

json.contributors @record.contributors do |user|
  json.id user.id
  json.slug user.slug
  json.username user.username
end
