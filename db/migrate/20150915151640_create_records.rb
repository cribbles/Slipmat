class CreateRecords < ActiveRecord::Migration
  def change
    create_table :records do |t|
      t.string :title, null: false
      t.integer :cat_no
      t.integer :year
      t.string :image_url
      t.text :notes

      t.timestamps null: false
    end
  end
end
