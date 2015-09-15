class Track < ActiveRecord::Base
  validates :title, presence: true
end
