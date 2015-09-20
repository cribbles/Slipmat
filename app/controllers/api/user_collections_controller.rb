module Api
  class UserCollectionsController < ApplicationController

    def create
      if uc_params[:user_id] == current_user.id
        @collection = UserCollection.new(uc_params)

        if @collection.save
          render :show
        else
          render json: @collection.errors.full_messages, status: 422
        end
      else
        head :forbidden
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

    private

    def uc_params
      params
        .require(:user_collection)
        .permit(:user_id, :record_id)
    end
  end
end
