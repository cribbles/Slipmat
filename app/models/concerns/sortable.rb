module Sortable
  extend ActiveSupport::Concern

  def sortable_by(*tables)
    @sortable_by ||= tables.map(&:to_s)
  end

  def order_by(order)
    parsed = parse_order(order)
    order(parsed)
  end

  private

  def parse_order(order)
    return "created_at DESC" if order.blank?

    table, order = order.split(",").map(&:downcase)
    table = (@sortable_by.include?(table) ? table : "created_at")
    order = (["asc", "desc"].include?(order) ? order : "ASC")

    "#{to_s.downcase.pluralize}.#{table} #{order}"
  end
end
