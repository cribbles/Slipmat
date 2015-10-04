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
        .includes(:genres)
        .find(params[:id])

      if @record.update(record_update_params)
        add_contribution(@record)
        render json: @record
      else
        render json @record.errors.full_messages, status: 422
      end
    end

    def show
      @record = Record
        .includes(:artist)
        .includes(:label)
        .includes(:country)
        .includes(:genres)
        .includes(:tracks)
        .includes(:comments)
        .includes(:contributors)
        .find(params[:id])

      render :show
    end

    def index
      @records = Record
        .includes(:artist)
        .order(created_at: :desc)
        .page(params[:page])

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
  end
end
