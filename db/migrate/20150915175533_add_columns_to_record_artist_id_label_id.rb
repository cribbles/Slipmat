class AddColumnsToRecordArtistIdLabelId < ActiveRecord::Migration
  def change
    add_column :records, :artist_id, :integer, null: false
    add_column :records, :label_id, :integer

    add_index :records, :artist_id
    add_index :records, :label_id
  end
end
