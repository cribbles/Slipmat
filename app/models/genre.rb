class Genre < ActiveRecord::Base
  has_many :genre_taggings
  has_many :records, through: :genre_taggings
  validates :name, presence: true, uniqueness: true
end
