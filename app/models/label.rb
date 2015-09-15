class Label < ActiveRecord::Base
  has_many :records
  validates :title, presence: true, uniqueness: true
end
