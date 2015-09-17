module Api
  class UserCollectionsController < ApplicationController

    def create
      @collection = UserCollection.new({
        user_id: params[:user_collection][:user_id],
        record_id: params[:user_collection][:record_id]
      })

      if @collection.save
        render json: @collection
      else
        render json: @collection.errors.full_messages, status: 422
      end
    end

    def destroy
      collection = UserCollection.find(params[:id])
      collection.destroy!

      render json: {}
    end
  end
end
