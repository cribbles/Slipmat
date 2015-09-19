class Track < ActiveRecord::Base
  belongs_to :record
  validates :title, presence: true

  default_scope { order(:ord) }
end
