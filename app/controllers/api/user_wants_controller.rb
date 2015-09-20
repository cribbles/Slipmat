module Api
  class UserWantsController < ApplicationController

    def create
      if uw_params[:user_id] == current_user.id
        @want = UserWant.new(uw_params)
        if @want.save
          render :show
        else
          render json: @want.errors.full_messages, status: 422
        end
      else
        head :forbidden
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

    private

    def uw_params
      params
        .require(:user_want)
        .permit(:user_id, :record_id)
    end
  end
end
