json.statistics do
  json.partial! 'api/shared/statistics'
end

json.partial! 'records', records: @records
