class AddAttachmentToArtistsLabelsUsersImage < ActiveRecord::Migration
  def change
    add_attachment :artists, :image
    add_attachment :labels, :image
    add_attachment :users, :image
  end
end
