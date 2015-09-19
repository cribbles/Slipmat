class ChangeColumnCommentsBodyNullFalse < ActiveRecord::Migration
  def change
    change_column :comments, :body, :text, null: false
  end
end
