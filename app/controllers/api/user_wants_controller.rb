module Api
  class UserWantsController < ApplicationController

    def create
      @want = UserWant.new(
        user_id: current_user.id,
        record_id: params[:record_id]
      )
      if @want.save
        render json: { list_id: @want.id }
      else
        render json: @want.errors.full_messages, status: 422
      end
    end

    def destroy
      want = UserWant.find(params[:id])

      if want.user_id == current_user.id
        want.destroy!
        render json: {}
      else
        head :forbidden
      end
    end

    def show
      @want = UserWant.find(params[:id])
    end
  end
end
