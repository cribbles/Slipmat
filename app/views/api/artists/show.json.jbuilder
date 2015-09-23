json.extract!(
  @artist,
  :id,
  :name,
  :real_name,
  :profile
)

json.image asset_path(@artist.image.url)

json.records do
  json.partial! 'api/records/records', records: @records
end

json.comments @artist.comments, partial: 'api/comments/comment', as: :comment

json.contributors @artist.contributors do |user|
  json.id user.id
  json.username user.username
end
