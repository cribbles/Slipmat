class CreateUserActivities < ActiveRecord::Migration
  def change
    create_table :user_activities do |t|
      t.integer :user_id, null: false
      t.integer :activity_id, null: false
      t.string :activity_class, null: false
      t.string :activity_action, null: false

      t.timestamps null: false
    end

    add_index :user_activities, :user_id
  end
end
