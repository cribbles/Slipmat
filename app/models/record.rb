class Record < ActiveRecord::Base
  include Formattable
  include PgSearch
  extend Sortable

  sortable_by :created_at, :title

  belongs_to :artist
  belongs_to :label
  belongs_to :country

  delegate :name, to: :artist, prefix: true
  multisearchable against: [:title, :artist_name], using: {
                    tsearch: { prefix: true },
                    trigram: { threshold: 0.3 }
  }

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

  scope :find_by_country, -> (country) {
     joins(:country)
    .where("LOWER(countries.name) = ?", country.downcase)
  }

  scope :find_by_genre, -> (genre) {
     joins(:genres)
    .where("LOWER(genres.name) = ?", genre.downcase)
  }

  scope :find_by_user, -> (user) {
    find_by_sql([<<-SQL, user.id, user.id])
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
        users.id = ?
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

  scope :indexed, -> (page: page, order: order) {
    page = [page.to_i, 1].max
    offset = 30 * (page - 1).to_i
    order = parse_order(order)

    Kaminari.paginate_array(
      find_by_sql([<<-SQL, offset]), total_count: Record.count
        SELECT
          records.*,
          artists.id AS a_id,
          artists.name AS a_name
        FROM
          records
        JOIN
          artists ON artists.id = records.artist_id
        ORDER BY
          #{order}
        LIMIT
          30
        OFFSET
          ?
      SQL
    ).page(page)
  }

  def self.find_with_associated(id)
    self
      .includes(:genres)
      .includes(:tracks)
      .includes(comments: :author)
      .includes(:contributors)
      .find_by_sql([<<-SQL, id.to_i]).first
       SELECT
         records.*,
         artists.id AS a_id,
         artists.name AS a_name,
         labels.id AS l_id,
         labels.title AS l_title,
         countries.id AS c_id,
         countries.name AS c_name
       FROM
         records
       JOIN
         artists ON artists.id = records.artist_id
       LEFT OUTER JOIN
         labels ON labels.id = records.label_id
       LEFT OUTER JOIN
         countries ON countries.id = records.country_id
       WHERE
         records.id = ?
      SQL
  end

  def artist_name=(artist_name)
    artist = Artist
      .where("lower(name) = ?", artist_name.downcase)
      .first_or_create { |artist| artist.name = artist_name.downcase }

    self.artist_id = artist.id
  end

  def label_name=(label_name)
    label = Label
      .where("lower(title) = ?", label_name.downcase)
      .first_or_create { |label| label.title = label_name.downcase }

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
