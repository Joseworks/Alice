class Admin::SessionsController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => :create
  layout 'login'

  def show
    if session[:user_id]
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
    if user.email.include?("quidnuncre.com")
      session[:logged_in] = true
      session[:user_id] = user.id
      session[:username] = user.name
      redirect_to admin_root_path, notice: "Signed in!"
    else
      redirect_to action: 'new'
    end
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

  helper_method :allow_login_bypass?
end
