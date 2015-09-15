class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.integer :record_id, null: false
      t.string :title, null: false
      t.string :duration

      t.timestamps null: false
    end

    add_index :tracks, :record_id
  end
end
