json.id comment.id
json.author do
  json.id comment.author.id
  json.slug comment.author.slug
  json.username comment.author.username
  json.image asset_path(comment.author.image.url)
end
json.created_at comment.created_at
json.body comment.body
