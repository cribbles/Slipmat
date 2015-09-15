module Api
  class ArtistsController < ApplicationController

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

      render json: @artist
    end

    def index
      @artist = Artist.all

      render json: @artist
    end

    private

    def artist_params
      params
        .require(:artist)
        .permit(:name, :real_name, :profile)
    end
  end
end
