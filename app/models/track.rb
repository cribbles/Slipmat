class Track < ActiveRecord::Base
  VALID_DURATION_REGEX = /\A([0-9]+):[0-5][0-9]\z/

  belongs_to :record

  validates :title, :ord, presence: true
  validates :duration, with: { format: VALID_DURATION_REGEX }

  before_validation :ensure_ord

  default_scope { order(:ord) }

  private

  def ensure_ord
    if ord.blank?
      if record && record.tracks.any?
        highest_previous_ord = record.tracks.max_by(&:ord).ord
      else
        highest_previous_ord = 0
      end

      self.ord = highest_previous_ord + 1
    end

    puts self.attributes
  end
end
