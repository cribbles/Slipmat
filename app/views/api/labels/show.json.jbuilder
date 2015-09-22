json.extract!(
  @label,
  :id,
  :title,
  :profile
)

json.image asset_path(@label.image.url)

json.records @label.records, partial: 'api/records/record', as: :record

json.comments @label.comments, partial: 'api/comments/comment', as: :comment

json.contributors @label.contributors do |user|
  json.id user.id
  json.username user.username
end
