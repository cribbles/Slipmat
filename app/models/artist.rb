class Artist < ActiveRecord::Base
  include PgSearch
  extend Sortable

  sortable_by :created_at, :name

  multisearchable against: :name, using: {
                    tsearch: { prefix: true },
                    trigram: { threshold: 0.3 }
                  }

  has_many :records, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :user_contributions, as: :contributable
  has_many :contributors, through: :user_contributions, source: :user
  validates :name, presence: true, uniqueness: true

  has_attached_file :image, default_url: "default-artist.png",
                            style: { thumb: "150x150#" }
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
end
