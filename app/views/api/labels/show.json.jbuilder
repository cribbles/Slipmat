json.extract!(
  @label,
  :id,
  :title,
  :profile
)

json.image asset_path(@label.image.url)

json.records do
  json.partial! 'api/records/records', records: @records
end

json.comments @label.comments, partial: 'api/comments/comment', as: :comment

json.contributors @label.contributors do |user|
  json.id user.id
  json.slug user.slug
  json.username user.username
end
