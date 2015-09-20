module Api
  class LabelsController < ApplicationController
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

      if @label.update(label_params)
        render json: @label
      else
        render json @label.errors.full_messages, status: 422
      end
    end

    def destroy
      @label = Label.find(params[:id])
      @label.destroy!

      render json: @label
    end

    def show
      @label = Label.find(params[:id])

      render json: @label
    end

    def index
      @label = Label.all

      render json: @label
    end

    private

    def label_params
      params
        .require(:label)
        .permit(:title, :profile)
    end
  end
end
