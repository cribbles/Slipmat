module Contributable
  extend ActiveSupport::Concern

  def add_contribution(model)
    UserContribution.create(
      user_id: current_user.id,
      contribution_id: model.id,
      contribution_type: model.class
    )
  end
end
