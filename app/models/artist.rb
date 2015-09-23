class Artist < ActiveRecord::Base
  include PgSearch
  multisearchable against: :name, using: {
                    tsearch: { prefix: true },
                    trigram: { threshold: 0.3 }
                  }

  has_many :records, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :user_contributions, as: :contributable
  has_many :contributors, through: :user_contributions, source: :user
  validates :name, presence: true, uniqueness: true

  has_attached_file :image, default_url: "default-artist.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
end
