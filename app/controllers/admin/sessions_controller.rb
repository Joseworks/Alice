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

    if params[:openid_url].present?
      authenticate_with_open_id(params[:openid_url]) do |result, identity_url|
        if result.successful?
          if user = User.with_open_id_url(identity_url)
            return successful_login(user)
          else
            flash.now[:error] = result.message
          end
        else
          flash.now[:error] = "Sorry, the OpenID server couldn't be found"
        end
      end
    else
      flash.now[:error] = "You must supply a URL"
    end
    render :action => 'new'
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
