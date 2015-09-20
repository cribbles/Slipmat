class UserWant < ActiveRecord::Base
  def self.user_foreign_key
    "user_id"
  end

  include Trackable

  belongs_to :user
  belongs_to :record

  validates_uniqueness_of :record_id, scope: :user_id
end
