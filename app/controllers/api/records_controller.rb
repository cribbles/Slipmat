module Api
  class RecordsController < ApplicationController
    include Contributable

    before_action :ensure_signed_in, except: [:index, :show]

    def create
      @record = Record.new(record_params)

      if @record.save
        add_contribution(@record)
        render json: @record
      else
        render json: @record.errors.full_messages, status: 422
      end
    end

    def update
      @record = Record
        .includes(:artist)
        .find(params[:id])

      if @record.update(record_update_params)
        add_contribution(@record)
        render json: @record
      else
        render json @record.errors.full_messages, status: 422
      end
    end

    def show
      @record = Record.find_with_associated(params[:id])

      if @record
        render :show
      else
        render json: {}, status: 404
      end
    end

    def index
      @records = Record.indexed(params[:page], sort)
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
          :label_name,
          :cat_no,
          :country_id,
          :year,
          :notes,
          :discogs_id,
          genres: [],
          genre_ids: [],
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
          :image_url,
          :label_name,
          :cat_no,
          :country_id,
          :year,
          :notes,
          genre_ids: [],
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

    def sort
      return "created_at DESC" if params[:sort].blank?

      valid_tables = [
        'created_at',
        'title'
      ]
      valid_orders = [
        'asc',
        'desc'
      ]

      table, order = params[:sort].split(",").map(&:downcase)
      table = (valid_tables.include?(table) ? table : "created_at")
      order = (valid_orders.include?(order) ? order : "asc")
      table + " " + order
    end
  end
end
