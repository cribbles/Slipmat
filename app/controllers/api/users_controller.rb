module Api
  class UsersController < ApplicationController

    def create
      @user = User.new(user_params)

      if @user.save
        sign_in!(@user)
        render :show
      else
        render json: @user.errors.full_messages, status: 422
      end
    end

    def show
      @user = User
                .includes(:authored_comments)
                .includes(:contributions)
                .includes(:collection)
                .includes(:wantlist)
                .find(params[:id])

      render :show
    end

    private

    def user_params
      params
        .require(:user)
        .permit(:username, :email, :password)
    end
  end
end
