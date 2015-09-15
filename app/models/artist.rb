class Artist < ActiveRecord::Base
  has_many :records
  validates :name, presence: true, uniqueness: true
end
