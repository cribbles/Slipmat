module Api
  class UserCollectionsController < ApplicationController

    def create
      @collection = UserCollection.new(
        user_id: current_user.id,
        record_id: params[:record_id]
      )
      if @collection.save
        render json: { list_id: @collection.id }
      else
        render json: @collection.errors.full_messages, status: 422
      end
    end

    def destroy
      collection = UserCollection.find(params[:id])

      if collection.user_id == current_user.id
        collection.destroy!
        render json: {}
      else
        head :forbidden
      end
    end

    def show
      @collection = UserCollection.find(params[:id])
    end
  end
end
