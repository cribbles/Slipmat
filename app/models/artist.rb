class Artist < ActiveRecord::Base
  validates :name, uniqueness: true
end
