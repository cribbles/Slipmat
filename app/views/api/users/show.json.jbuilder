json.partial! "api/users/user", user: @user

unless @user.wantlist.empty?
  json.wantlist @user.wantlist
end

unless @user.collection.empty?
  json.collection @user.collection
end
