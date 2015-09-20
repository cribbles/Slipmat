class CreateGenreTaggings < ActiveRecord::Migration
  def change
    create_table :genre_taggings do |t|
      t.integer :genre_id, null: false
      t.integer :record_id, null: false

      t.timestamps null: false
    end

    add_index :genre_taggings, :genre_id
    add_index :genre_taggings, :record_id
    add_index :genre_taggings, [:genre_id, :record_id], unique: true
  end
end
