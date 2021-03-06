module Api
  class ArtistsController < ApplicationController
    include Contributable

    before_action :ensure_signed_in, except: [:index, :show]

    def create
      @artist = Artist.new(artist_params)

      if @artist.save
        render json: @artist
      else
        render json: @artist.errors.full_messages, status: 422
      end
    end

    def update
      @artist = Artist.find(params[:id])

      if @artist.update(artist_update_params)
        add_contribution(@artist)
        render json: @artist
      else
        render json: @artist.errors.full_messages, status: 422
      end
    end

    def show
      @artist = Artist
        .includes(:comments)
        .includes(:contributors)
        .find(params[:id])

      @records = @artist
        .records
        .page(params[:page])

      render :show
    end

    def index
      @artists = Artist
        .order_by(params[:order])
        .page(params[:page])

      render :index
    end

    private

    def artist_params
      params
        .require(:artist)
        .permit(:name)
    end

    def artist_update_params
      params
        .require(:artist)
        .permit(:real_name, :profile, :image)
    end
  end
end
