class Artist < ActiveRecord::Base
  has_many :records, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  validates :name, presence: true, uniqueness: true
end
