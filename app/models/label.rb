class Label < ActiveRecord::Base
  has_many :records
  has_many :comments, as: :commentable
  validates :title, presence: true, uniqueness: true
end
