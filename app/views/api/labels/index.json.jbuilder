json.statistics do
  json.partial! 'api/shared/statistics'
end

json.pages do
  json.partial! 'api/shared/pages', collection: @labels
end

json.labels @labels, partial: 'label', as: :label
