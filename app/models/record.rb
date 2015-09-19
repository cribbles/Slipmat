class Record < ActiveRecord::Base
  include Formattable

  belongs_to :artist
  belongs_to :label
  belongs_to :country
  has_many :tracks
  has_many :user_collections
  has_many :collected, through: :user_collections, source: :user
  has_many :user_wants
  has_many :wanted, through: :user_wants, source: :user
  has_many :user_contributions
  has_many :contributors, through: :user_contributions, source: :user
  has_many :comments, as: :commentable

  validates :title, presence: true
  validates :artist_id, presence: true

  def artist_name=(artist_name)
    artist = Artist.new(name: artist_name)
    artist.save!

    self.artist_id = artist.id
  end

  def label_name=(label_name)
    label = Label.new(title: label_name)
    label.save!

    self.label_id = label.id
  end
end
