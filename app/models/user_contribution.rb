class UserContribution < ActiveRecord::Base
  def self.user_foreign_key
    "user_id"
  end

  include Trackable

  belongs_to :user, counter_cache: true
  belongs_to :contributable, polymorphic: true

  validates_uniqueness_of :user_id, scope: [
    :contributable_id, :contributable_type
  ]
end
