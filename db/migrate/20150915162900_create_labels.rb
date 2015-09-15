class CreateLabels < ActiveRecord::Migration
  def change
    create_table :labels do |t|
      t.string :title, null: false
      t.text :profile

      t.timestamps null: false
    end

    add_index :labels, :title, unique: true
  end
end
