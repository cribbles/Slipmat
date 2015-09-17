module Formattable
  extend ActiveSupport::Concern

  def created_at
    super.strftime("%B %-d, %Y")
  end

  def updated_at
    super.strftime("%B %-d, %Y")
  end
end
