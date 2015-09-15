class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user
  helper_method :signed_in?

  def sign_in!(user)
    session[:session_token] = user.reset_session_token!
    @current_user = user
  end

  def sign_out!(user)
    user.try(:reset_session_token!)
    session[:session_token] = nil
  end

  def current_user
    return nil if session[:session_token].nil?

    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def signed_in?
    !!current_user
  end

  def ensure_signed_out
    redirect_to root_url if signed_in?
  end
end
