json.statistics do
  json.num_records @search_results.where(searchable_type: "Record").count
  json.num_artists @search_results.where(searchable_type: "Artist").count
  json.num_labels @search_results.where(searchable_type: "Label").count
end

json.pages do
  json.partial! 'api/shared/pages', collection: @search_results
end

json.results do
  json.array! @search_results do |search_result|
    json.searchable_type search_result.searchable_type
    case search_result.searchable_type
    when "Record"
      json.partial! "api/records/record", record: search_result.searchable
    when "Artist"
      json.partial! "api/artists/artist", artist: search_result.searchable
    when "Label"
      json.partial! "api/labels/label", label: search_result.searchable
    end
  end
end
