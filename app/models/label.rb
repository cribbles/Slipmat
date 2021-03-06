class Label < ActiveRecord::Base
  include PgSearch
  extend Sortable

  sortable_by :created_at, :title

  multisearchable against: :title, using: {
                    tsearch: { prefix: true },
                    trigram: { threshold: 0.3 }
                  }

  has_many :records
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :user_contributions, as: :contributable
  has_many :contributors, through: :user_contributions, source: :user
  validates :title, presence: true, uniqueness: true

  has_attached_file :image, default_url: "default-label.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
end
