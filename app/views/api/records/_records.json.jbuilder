json.pages do
  json.partial! 'api/shared/pages', collection: records
end

json.records records, partial: 'api/records/record', as: :record
