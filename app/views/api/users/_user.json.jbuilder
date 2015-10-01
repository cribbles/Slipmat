json.extract!(
  user,
  :id,
  :slug,
  :username,
  :email,
  :url,
  :location,
  :profile,
  :created_at
)

json.image asset_path(user.image.url)
json.num_comments user.comments_count
json.num_contributions user.user_contributions_count

associations = [];

json.wantlist do
  json.partial! 'api/records/records', records: user.wantlist.page(params[:page])
end

user.user_wants.each do |want|
  assocation = {
    id: want.id,
    record_id: want.record_id,
    type: :want
  }
  associations << assocation
end

json.collection do
  json.partial! 'api/records/records', records: user.collection.page(params[:page])
end

user.user_collections.each do |want|
  assocation = {
    id: want.id,
    record_id: want.record_id,
    type: :collection
  }
  associations << assocation
end

json.associations associations
