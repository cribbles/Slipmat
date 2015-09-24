class Record < ActiveRecord::Base
  include Formattable
  include PgSearch

  belongs_to :artist
  belongs_to :label
  belongs_to :country

  multisearchable against: [:title, :artist_name], using: {
                    tsearch: { prefix: true },
                    trigram: { threshold: 0.3 }
                  }
  delegate :name, to: :artist, prefix: true

  has_many :user_collections
  has_many :collected, through: :user_collections, source: :user
  has_many :user_wants
  has_many :wanted, through: :user_wants, source: :user
  has_many :user_contributions, as: :contributable
  has_many :contributors, through: :user_contributions, source: :user
  has_many :comments, as: :commentable
  has_many :genre_taggings
  has_many :genres, through: :genre_taggings

  has_many :tracks, dependent: :destroy
  accepts_nested_attributes_for :tracks,
    reject_if: ->(track) { track[:title].blank? },
    allow_destroy: true

  has_attached_file :image, default_url: "default-record.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  validates :title, presence: true
  validates :artist_id, presence: true

  def artist_name=(artist_name)
    artist = Artist.where("lower(name) = ?", artist_name.downcase).first
    artist ||= Artist.create(name: artist_name)

    self.artist_id = artist.id
  end

  def label_name=(label_name)
    label = Label.where("lower(title) = ?", label_name.downcase).first
    label ||= Label.create(title: label_name)

    self.label_id = label.id
  end

  def image_url=(image_url)
    self.image = open(image_url)
  end

  def genres=(genres)
    genre_ids = genres.inject([]) do |ids, name|
      ids << Genre.find_by(name: name).id
    end

    self.genre_ids = genre_ids
  end
end
