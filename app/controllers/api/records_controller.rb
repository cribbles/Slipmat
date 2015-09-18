module Api
  class RecordsController < ApplicationController

    def create
      @record = Record.new(record_params)

      if @record.save
        UserContribution.create(
          user_id: current_user.id,
          record_id: @record.id
        )

        render json: @record
      else
        render json: @record.errors.full_messages, status: 422
      end
    end

    def update
      @record = Record.find(params[:id])

      if @record.update(record_update_params)
        UserContribution.create(
          user_id: current_user.id,
          record_id: @record.id
        )

        render json: @record
      else
        render json @record.errors.full_messages, status: 422
      end
    end

    def destroy
      @record = Record.find(params[:id])
      @record.destroy!

      render json: @record
    end

    def show
      @record = Record.find(params[:id])

      render :show
    end

    def index
      @records = Record.all

      render :index
    end

    private

    def record_params
      params
        .require(:record)
        .permit(
          :title,
          :artist_name,
          :artist_id,
          :label_name,
          :label_id,
          :cat_no,
          :country,
          :image_url,
          :year,
          :notes
        )
    end

    def record_update_params
      params
        .require(:record)
        .permit(
          :label_name,
          :label_id,
          :cat_no,
          :country,
          :image_url,
          :year,
          :notes
        )
    end
  end
end
