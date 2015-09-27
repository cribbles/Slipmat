class AddCountsToRecordsUserWantsUserCollections < ActiveRecord::Migration
  def change
    add_column :records, :user_wants_count, :integer, default: 0
    add_column :records, :user_collections_count, :integer, default: 0

    Record.reset_column_information
    Record.find_each do |record|
      Record.reset_counters(record.id, :wanted)
      Record.reset_counters(record.id, :collected)
    end
  end
end
