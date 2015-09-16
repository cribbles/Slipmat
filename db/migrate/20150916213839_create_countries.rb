class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
      t.string :code, null: false
      t.string :name, null: false

      t.timestamps null: false
    end
  end
end
