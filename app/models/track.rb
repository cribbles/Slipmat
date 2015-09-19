class Track < ActiveRecord::Base
  belongs_to :record
  validates :title, :record, :ord, presence: true
  before_validation :ensure_ord

  default_scope { order(:ord) }

  private

  def ensure_ord
    if ord.blank?
      highest_previous_ord = record.tracks.max_by(&:ord).try(:ord) || 0
      self.ord = highest_previous_ord + 1
    end
  end
end
