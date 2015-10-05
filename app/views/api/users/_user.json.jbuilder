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

wantlist = records.select { |record| record.list_type == "wantlist" }
collection = records.select { |record| record.list_type == "collection" }

json.wantlist do
  json.partial! 'api/records/records', records: wantlist
end

json.collection do
  json.partial! 'api/records/records', records: collection
end

associations = []

wantlist.each do |record|
  association = {
    id: record.list_id,
    record_id: record.id,
    type: :want
  }
  associations << association
end

collection.each do |record|
  association = {
    id: record.list_id,
    record_id: record.id,
    type: :collection
  }
  associations << association
end

json.associations associations
