class AddColumnToRecordsDiscogsId < ActiveRecord::Migration
  def change
    add_column :records, :discogs_id, :integer
  end
end
