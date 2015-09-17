class CreateUserWants < ActiveRecord::Migration
  def change
    create_table :user_wants do |t|
      t.integer :user_id, null: false
      t.integer :record_id, null: false

      t.timestamps null: false
    end

    add_index :user_wants, :user_id
    add_index :user_wants, :record_id
    add_index :user_wants, [:user_id, :record_id], unique: true
  end
end
