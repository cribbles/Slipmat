class Comment < ActiveRecord::Base
  def self.user_foreign_key
    "author_id"
  end

  include Trackable
  include Formattable

  belongs_to(
    :author,
    class_name: "User",
    foreign_key: :author_id,
    counter_cache: true
  )
  belongs_to :commentable, polymorphic: true

  validates :body, presence: true
end
