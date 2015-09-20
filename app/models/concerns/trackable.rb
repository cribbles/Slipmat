module Trackable
  extend ActiveSupport::Concern

  included do
    after_create :user_activity_create
    after_update :user_activity_update
    before_destroy :user_activity_destroy

    ["create", "update", "destroy"].each do |action|
      define_method "user_activity_#{action}" do
        UserActivity.create(
          user_id: self.class.user_foreign_key,
          activity_id: id,
          activity_class: self.class,
          activity_action: action
        )
      end
    end
  end
end
