class ApplicationController < ActionController::Base
  EXCEPTIONS_NOT_LOGGED = ['ActionController::RoutingError']

  protect_from_forgery

  protected
    def log_error(exc)
      super unless EXCEPTIONS_NOT_LOGGED.include?(exc.class.name)
    end

    def redirect_back_or_default(default)
      redirect_to(session[:return_to] || default)
      session[:return_to] = nil
    end
  
end
