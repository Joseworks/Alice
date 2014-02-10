class Admin::SessionsController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: :create
  layout 'login'

  def show
    redirect_to action: 'new'
  end

  def new
  end

  def create

    if allow_login_bypass? && params[:bypass_login]
      auth = dev_user
    else
      auth = request.env["omniauth.auth"]
    end

    user = User.find_by_uid(auth["uid"]) || User.create_with_omniauth(auth)
    user.last_logged_in = Time.now
    user.save
    if user.email.include?("quidnuncre.com")
      session[:logged_in] = true
      session[:user_id] = user.id
      session[:username] = user.name
      redirect_to admin_root_path, notice: "Signed in!"
    else
      flash[:error] = "login fails."
      render action: 'new'
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

    def allow_login_bypass?
      %w(development test production).include?(Rails.env)
    end

    def dev_user
      { "info" => {"name"    => "Don Alias",
                  "email"   => "testuser@quidnuncre.com"},
        "provider" =>  "google_oauth2",
        "uid" =>      "averylongnumber",
        "last_logged_in" => Time.now }
    end

end
