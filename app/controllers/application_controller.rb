class ApplicationController < ActionController::Base
  protect_from_forgery

  # basic auth to make site a little secret so we can turn off OpenID for demos until it's ready
  # http_basic_authenticate_with name: "quidnunc", password: "dev0pass&&"

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
