json.statistics do
  json.num_records Record.count
  json.num_artists Artist.count
  json.num_labels Label.count
end

json.pages do
  json.out_of_range true if @records.out_of_range?

  per_page = 24
  lower_limit = (@records.current_page - 1) * per_page + 1
  upper_limit = [(lower_limit + per_page - 1), @records.total_count].min

  json.current_page @records.current_page
  json.total_count @records.total_count
  json.prev_page @records.prev_page
  json.next_page @records.next_page
  json.lower_limit lower_limit
  json.upper_limit upper_limit
end

json.records @records, partial: 'record', as: :record
