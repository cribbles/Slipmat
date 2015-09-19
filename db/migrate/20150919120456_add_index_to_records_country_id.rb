class AddIndexToRecordsCountryId < ActiveRecord::Migration
  def change
    add_index :records, :country_id
  end
end
