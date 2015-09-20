class GenreTagging < ActiveRecord::Base
  belongs_to :genre
  belongs_to :record

  validates_uniqueness_of :genre_id, scope: :record_id
end
