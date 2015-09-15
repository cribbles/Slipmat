class CreateArtists < ActiveRecord::Migration
  def change
    create_table :artists do |t|
      t.string :name, null: false
      t.string :real_name, null: false
      t.text :profile, null: false

      t.timestamps null: false
    end

    add_index :artists, :name, unique: true
  end
end
