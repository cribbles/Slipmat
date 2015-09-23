json.out_of_range true if collection.out_of_range?

per_page = 30
lower_limit = (collection.current_page - 1) * per_page + 1
upper_limit = [(lower_limit + per_page - 1), collection.total_count].min

json.current_page collection.current_page
json.total_count collection.total_count
json.prev_page collection.prev_page
json.next_page collection.next_page
json.lower_limit lower_limit
json.upper_limit upper_limit
