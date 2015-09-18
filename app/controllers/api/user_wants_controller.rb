module Api
  class UserWantsController < ApplicationController

    def create
      @want = UserWant.new({
        user_id: params[:user_want][:user_id],
        record_id: params[:user_want][:record_id]
      })

      if @want.save
        render :show
      else
        render json: @want.errors.full_messages, status: 422
      end
    end

    def destroy
      want = UserWant.find(params[:id])
      want.destroy!

      render json: {}
    end

    def show
      @want = UserWant.find(params[:id])
    end
  end
end