class ChangeColumnsArtistsRealNameProfileNullTrue < ActiveRecord::Migration
  def change
    change_column_null :artists, :real_name, true
    change_column_null :artists, :profile, true
  end
end
