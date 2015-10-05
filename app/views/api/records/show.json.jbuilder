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
  json.id @record.a_id
  json.name @record.a_name
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

if @record.l_id
  json.label do
    json.id @record.l_id
    json.title @record.l_title
  end
end

if @record.c_id
  json.country do
    json.id @record.c_id
    json.name @record.c_name
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
