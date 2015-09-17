class CreateUserCollections < ActiveRecord::Migration
  def change
    create_table :user_collections do |t|
      t.integer :user_id, null: false
      t.integer :record_id, null: false

      t.timestamps null: false
    end

    add_index :user_collections, :user_id
    add_index :user_collections, :record_id
    add_index :user_collections, [:user_id, :record_id], unique: true
  end
end
