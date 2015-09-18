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

json.num_reviews user.authored_comments.where(commentable_type: "Record").count
associations = [];

unless user.contributions.empty?
  json.contributions user.contributions, partial: 'api/records/record', as: :record
end

unless user.wantlist.empty?
  json.wantlist user.wantlist, partial: 'api/records/record', as: :record

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
  json.collection user.collection, partial: 'api/records/record', as: :record

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
