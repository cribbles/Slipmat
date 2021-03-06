module Api
  class SessionsController < ApplicationController

    def show
      if signed_in?
        @user = User.find(current_user.id)
        @records = Record.find_by_user(current_user)

        render :show
      else
        render json: {}, status: 422
      end
    end

    def create
      @user = User.find_by_credentials(
        params[:user][:username],
        params[:user][:password]
      )

      if @user.nil?
        response = ["Couldn't find a user with that username or password."]
        render json: response, status: 422
      else
        sign_in!(@user)
        @records = Record.find_by_user(current_user)
        render :show
      end
    end

    def destroy
      sign_out!
      render json: {}
    end

    def omniauth
      user = User.find_or_create_by_auth_hash(auth_hash)
      sign_in!(user)
      redirect_to root_url
    end

    private

    def auth_hash
      request.env["omniauth.auth"]
    end
  end
end
