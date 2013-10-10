class Admin::SessionsController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => :create
  # before_filter :verify_authenticity_token_unless_openid, :only => :create
  layout 'login'

  def show
    if session[:logged_in]
      puts "FROG RETURNZ"
      redirect_to admin_root_path, notice: "welcome back!" and return
    else
      redirect_to :action => 'new'
    end
  end

  def new
  end

  def create
    return successful_login(User.first) if allow_login_bypass? && params[:bypass_login]

    auth = request.env["omniauth.auth"]
    user = User.find_by_uid(auth["uid"]) || User.create_with_omniauth(auth)
    session[:logged_in] = true
    session[:user_id] = user.id
    redirect_to admin_root_path, notice: "Signed in!"
  end

  def destroy
    session[:logged_in] = nil
    session[:user_id] = nil
    redirect_to('/')
  end

  def failure
    redirect_to root_url, alert: "Authentication failed, please try again."
  end

protected

  def open_id_authentication
    authenticate_with_open_id do |result, identity_url|
      if result.successful?
        if user = User.with_openid_url(identity_url)
          return successful_login(user)
        else
          failed_login result.message
        end
      else
        failed_login "Sorry, the OpenID server couldn't be found"
      end
    end
  end

  def successful_login(user)
    session[:logged_in] = true
    session[:user_id] = user.id
    redirect_to(admin_root_path)
  end

  def failed_login(message)
    flash[:error] = message
    redirect_to(action: 'new')
  end

  def allow_login_bypass?
    %w(development test).include?(Rails.env)
  end

  def verify_authenticity_token_unless_openid
    verify_authenticity_token unless using_open_id?
  end

  helper_method :allow_login_bypass?
end
