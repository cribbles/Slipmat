class Record < ActiveRecord::Base
  belongs_to :artist
  belongs_to :label
  has_many :tracks
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
