class Admin::SessionsController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => :create
  before_filter :verify_authenticity_token_unless_openid, :only => :create
  layout 'login'

  def show
    if using_open_id?
      create
    else
      redirect_to :action => 'new'
    end
  end

  def new
  end

  def create
    return successful_login(User.first) if allow_login_bypass? && params[:bypass_login]

    if params[:openid_url].blank? && !request.env[Rack::OpenID::RESPONSE]
      flash.now[:error] = "You must provide an OpenID URL"
      render :action => 'new'
    else
      authenticate_with_open_id(params[:openid_url]) do |result, identity_url|
        if result.successful?
          if enki_config.author_open_ids.include?(URI.parse(identity_url))
            return successful_login
          else
            flash.now[:error] = "You are not authorized"
          end
        else
          flash.now[:error] = result.message
        end
      end
      render :action => 'new'
    end
  end

  def destroy
    session[:logged_in] = nil
    redirect_to('/')
  end

protected

  def successful_login(user)
    session[:logged_in] = true
    session[:user_id] = user.id
    redirect_to(admin_root_path)
  end

  def allow_login_bypass?
    %w(development test).include?(Rails.env)
    # %w(development test production).include?(Rails.env)
  end

  def verify_authenticity_token_unless_openid
    verify_authenticity_token unless using_open_id?
  end

  helper_method :allow_login_bypass?
end
