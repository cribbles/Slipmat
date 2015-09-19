class Track < ActiveRecord::Base
  belongs_to :record
  validates :title, :record, :ord, presence: true

  default_scope { order(:ord) }
end
