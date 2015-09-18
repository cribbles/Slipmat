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

associations = [];

unless user.wantlist.empty?
  json.wantlist user.wantlist
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
  json.collection user.collection
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
