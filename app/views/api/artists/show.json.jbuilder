json.extract!(
  @artist,
  :id,
  :name,
  :real_name,
  :profile
)

json.image asset_path(@artist.image.url)

json.records @artist.records, partial: 'api/records/record', as: :record

json.comments @artist.comments, partial: 'api/comments/comment', as: :comment

json.contributors @artist.contributors do |user|
  json.id user.id
  json.username user.username
end
