class Track < ActiveRecord::Base
  belongs_to :record
  validates :title, presence: true
end
