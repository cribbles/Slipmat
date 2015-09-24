class AlterTableUserContributionChangeIndex < ActiveRecord::Migration
  def change
    remove_index(
      :user_contributions, column: [
        :user_id,
        :contributable_id
      ]
    )

    add_index(
      :user_contributions, [
        :user_id,
        :contributable_id,
        :contributable_type
      ],
      unique: true,
      name: :index_user_contributions_on_user_id_and_contributable
    )
  end
end
