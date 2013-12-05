class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :current_user

  protected

  def enki_config
    @@enki_config = Enki::Config.default
  end
  helper_method :enki_config

  private

    def current_user
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

end
