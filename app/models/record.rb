class Record < ActiveRecord::Base
  validates :title, presence: true
end
