class AddAttachmentToRecordsImage < ActiveRecord::Migration
  def change
    remove_column :records, :image_url
    add_attachment :records, :image
  end
end
