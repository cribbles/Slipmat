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

  scope :find_by_country, -> (country) {
     joins(:country)
    .where("LOWER(countries.name) = ?", country.downcase)
  }

  scope :find_by_genre, -> (genre) {
     joins(:genres)
    .where("LOWER(genres.name) = ?", genre.downcase)
  }

  scope :find_by_user, -> (user) {
    find_by_sql([<<-SQL, user.id])
      SELECT
        records.* AS wantlist,
        'wantlist' AS list_type,
        user_wants.id AS list_id,
        artists.id AS a_id,
        artists.name AS a_name
      FROM
        users
      LEFT OUTER JOIN
        user_wants ON user_wants.user_id = users.id
      JOIN
        records ON records.id = user_wants.record_id
      JOIN
        artists ON artists.id = records.artist_id
      WHERE
        users.id = 6
      UNION ALL
      SELECT
        records.* AS collection,
        'collection' AS list_type,
        user_collections.id AS list_id,
        artists.id AS a_id,
        artists.name AS a_name
      FROM
        users
      LEFT OUTER JOIN
        user_collections ON user_collections.user_id = users.id
      JOIN
        records ON records.id = user_collections.record_id
      JOIN
        artists ON artists.id = records.artist_id
      WHERE
        users.id = ?
    SQL
  }

  scope :indexed, -> (page) {
    page = [page.to_i, 1].max
    offset = 30 * (page - 1).to_i

    Kaminari.paginate_array(
      Record.find_by_sql([<<-SQL, offset]), total_count: Record.count
        SELECT
          records.*,
          artists.id AS a_id,
          artists.name AS a_name
        FROM
          records
        JOIN
          artists ON artists.id = records.artist_id
        ORDER BY
          created_at DESC
        LIMIT
          30
        OFFSET
          ?
      SQL
    ).page(page)
  }

  validates :title, presence: true
  validates :artist_id, presence: true

  def artist_name=(artist_name)
    artist = Artist
      .where("lower(name) = ?", artist_name.downcase)
      .first_or_create do |artist|
        artist.name = artist_name.downcase
      end

    self.artist_id = artist.id
  end

  def label_name=(label_name)
    label = Label
      .where("lower(title) = ?", label_name.downcase)
      .first_or_create do |label|
        label.title = label_name.downcase
      end

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
