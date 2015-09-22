module Contributable
  extend ActiveSupport::Concern

  def add_contribution(model)
    UserContribution.create(
      user_id: current_user.id,
      contributable_id: model.id,
      contributable_type: model.class
    )
  end
end
