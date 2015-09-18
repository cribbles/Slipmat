class CreateUserContributions < ActiveRecord::Migration
  def change
    create_table :user_contributions do |t|
      t.integer :user_id, null: false
      t.integer :record_id, null: false

      t.timestamps null: false
    end

    add_index :user_contributions, :user_id
    add_index :user_contributions, :record_id
    add_index :user_contributions, [:user_id, :record_id], unique: true
  end
end
