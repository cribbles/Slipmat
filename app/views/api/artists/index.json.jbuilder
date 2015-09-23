json.statistics do
  json.partial! 'api/shared/statistics'
end

json.pages do
  json.partial! 'api/shared/pages', collection: @artists
end

json.artists @artists, partial: 'artist', as: :artist
