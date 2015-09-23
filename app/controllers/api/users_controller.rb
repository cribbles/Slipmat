module Api
  class UsersController < ApplicationController
    before_action :ensure_signed_out, only: :create

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

      @wantlist = @user
        .wantlist
        .includes(:artist)
        .page(params[:page])
        .per(24)

      @collection = @user
        .collection
        .includes(:artist)
        .page(params[:page])
        .per(24)

      render :show
    end

    def update
      if Integer(params[:id]) == current_user.id
        @user = User.find(params[:id])

        if @user.update(user_update_params)
          render json: @user
        else
          render json: @user.errors.full_messages, status: 422
        end
      else
        head :forbidden
      end
    end

    private

    def user_params
      params
        .require(:user)
        .permit(:username, :email, :password)
    end

    def user_update_params
      params
        .require(:user)
        .permit(:location, :url, :profile, :image)
    end
  end
end
