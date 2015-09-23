json.statistics do
  json.partial! 'api/shared/statistics'
end

json.pages do
  json.partial! 'api/shared/pages', collection: @records
end

json.records @records, partial: 'record', as: :record
