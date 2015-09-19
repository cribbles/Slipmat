class AddColumnsToTracksPositionOrder < ActiveRecord::Migration
  def change
    add_column :tracks, :position, :string
    add_column :tracks, :order, :integer, null: false
  end
end
