class Artist < ActiveRecord::Base
  has_many :records
  has_many :comments, as: :commentable
  validates :name, presence: true, uniqueness: true
end
