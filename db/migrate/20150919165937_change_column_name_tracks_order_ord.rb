class ChangeColumnNameTracksOrderOrd < ActiveRecord::Migration
  def change
    rename_column :tracks, :order, :ord
  end
end
