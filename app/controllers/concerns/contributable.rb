module Contributable
  extend ActiveSupport::Concern

  def add_contribution(model)
    params = {
      user_id: current_user.id,
      contributable_id: model.id,
      contributable_type: model.class.to_s
    }

    UserContribution.create(params) unless UserContribution.find_by(params)
  end
end
