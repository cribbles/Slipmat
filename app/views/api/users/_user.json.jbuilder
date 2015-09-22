json.extract!(
  user,
  :id,
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

unless user.wantlist.empty?
  json.wantlist(
    user.wantlist,
    partial: 'api/records/record',
    as: :record
  )

  user.user_wants.each do |want|
    assocation = {
      id: want.id,
      record_id: want.record_id,
      type: :want
    }
    associations << assocation
  end
end

unless user.collection.empty?
  json.collection(
    user.collection,
    partial: 'api/records/record',
    as: :record
  )

  user.user_collections.each do |want|
    assocation = {
      id: want.id,
      record_id: want.record_id,
      type: :collection
    }
    associations << assocation
  end
end

json.associations associations
