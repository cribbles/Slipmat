class AddColumnToRecordsCountryId < ActiveRecord::Migration
  def change
    add_column :records, :country_id, :integer
  end
end
