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
json.num_comments user.authored_comments.count
json.num_contributions user.contributions.count

associations = [];

json.wantlist do
  json.partial! 'api/records/records', records: @wantlist
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
  json.partial! 'api/records/records', records: @collection
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
