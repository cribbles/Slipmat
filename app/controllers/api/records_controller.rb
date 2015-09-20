module Api
  class RecordsController < ApplicationController
    before_action :ensure_signed_in, except: [:index, :show]

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
        unless current_user.contributions.include?(@record)
          UserContribution.create(
            user_id: current_user.id,
            record_id: @record.id
          )
        end

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
      @record = Record
                  .includes(:comments)
                  .includes(:contributors)
                  .includes(:collected)
                  .includes(:wanted)
                  .find(params[:id])

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
          :image,
          :artist_name,
          :artist_id,
          :label_name,
          :label_id,
          :cat_no,
          :genre_ids,
          :country_id,
          :year,
          :notes,
          tracks_attributes: [
            :id,
            :ord,
            :position,
            :title,
            :duration
          ]
        )
    end

    def record_update_params
      params
        .require(:record)
        .permit(
          :image,
          :label_name,
          :label_id,
          :cat_no,
          :genre_ids,
          :country_id,
          :year,
          :notes,
          tracks_attributes: [
            :id,
            :ord,
            :position,
            :title,
            :duration,
            :_destroy
          ]
        )
    end
  end
end
