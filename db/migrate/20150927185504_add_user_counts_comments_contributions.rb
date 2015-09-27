class AddUserCountsCommentsContributions < ActiveRecord::Migration
  def change
    add_column :users, :comments_count, :integer, default: 0
    add_column :users, :user_contributions_count, :integer, default: 0

    User.reset_column_information
    User.find_each do |user|
      User.reset_counters(user.id, :authored_comments)
      User.reset_counters(user.id, :contributions)
    end
  end
end
