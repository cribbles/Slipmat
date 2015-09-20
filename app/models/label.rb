class Label < ActiveRecord::Base
  has_many :records
  has_many :comments, as: :commentable, dependent: :destroy
  validates :title, presence: true, uniqueness: true

  has_attached_file :image, default_url: "default-label.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
end
