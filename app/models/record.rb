class Record < ActiveRecord::Base
  belongs_to :artist
  belongs_to :label
  has_many :tracks
  validates :title, presence: true
end
