module Api
  class LabelsController < ApplicationController
    include Contributable
    before_action :ensure_signed_in, except: [:index, :show]

    def create
      @label = Label.new(label_params)

      if @label.save
        render json: @label
      else
        render json: @label.errors.full_messages, status: 422
      end
    end

    def update
      @label = Label.find(params[:id])

      if @label.update(label_update_params)
        add_contribution(@label)
        render json: @label
      else
        render json @label.errors.full_messages, status: 422
      end
    end

    def show
      @label = Label
        .includes(records: :artist)
        .includes(:comments)
        .includes(:contributors)
        .find(params[:id])

      @records = @label
        .records
        .page(params[:page])

      render :show
    end

    def index
      @labels = Label
        .order_by(params[:order])
        .page(params[:page])

      render :index
    end

    private

    def label_params
      params
        .require(:label)
        .permit(:title)
    end

    def label_update_params
      params
        .require(:label)
        .permit(:profile, :image)
    end
  end
end
