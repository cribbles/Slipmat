module Api
  class SearchController < ApplicationController
    def search
      @search_results = PgSearch
        .multisearch(params[:query])
        .includes(:searchable)
        .page(params[:page])

      render :search
    end

    def filter
      @records = Record.where(nil)

      @records = @records.where(year: params[:year])        if params[:year]
      @records = @records.find_by_country(params[:country]) if params[:country]
      @records = @records.find_by_genre(params[:genre])     if params[:genre]

      @records = @records.includes(:artist).page(params[:page])
      @params = params.slice(:year, :country, :genre)

      render :filter
    end
  end
end
