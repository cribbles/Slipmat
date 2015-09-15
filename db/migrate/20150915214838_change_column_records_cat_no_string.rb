class ChangeColumnRecordsCatNoString < ActiveRecord::Migration
  def change
    change_column :records, :cat_no, :string
  end
end
