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

      if @artist.update(artist_params)
        add_contribution(@artist)
        render json: @artist
      else
        render json @artist.errors.full_messages, status: 422
      end
    end

    def destroy
      @artist = Artist.find(params[:id])
      @artist.destroy!

      render json: @artist
    end

    def show
      @artist = Artist.find(params[:id])

      render :show
    end

    def index
      @artists = Artist.all

      render json: @artists
    end

    private

    def artist_params
      params
        .require(:artist)
        .permit(:name, :real_name, :profile)
    end
  end
end
