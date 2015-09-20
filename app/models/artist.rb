class Artist < ActiveRecord::Base
  has_many :records, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  validates :name, presence: true, uniqueness: true

  has_attached_file :image, default_url: "default-artist.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
end
