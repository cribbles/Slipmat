json.extract!(
  @artist,
  :id,
  :name,
  :real_name,
  :profile
)

json.image asset_path(@artist.image.url)

json.records @artist.records, partial: 'api/records/record', as: :record

json.comments @artist.comments, partial: 'api/shared/comment', as: :comment
