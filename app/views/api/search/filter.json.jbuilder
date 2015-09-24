json.sort do
  json.type params.keys.first.capitalize
  json.value params.values.first.titleize
end

json.partial! 'api/records/records', records: @records
