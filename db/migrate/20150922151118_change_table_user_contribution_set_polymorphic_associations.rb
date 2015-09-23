class ChangeTableUserContributionSetPolymorphicAssociations < ActiveRecord::Migration
  def change
    rename_column :user_contributions, :record_id, :contributable_id
    add_column :user_contributions, :contributable_type, :string

    UserContribution.reset_column_information
    UserContribution.update_all(contributable_type: "Record")
  end
end
