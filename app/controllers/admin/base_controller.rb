class Admin::BaseController < ApplicationController
  layout 'admin'

  before_filter :authenticate_user!

  protected

  def require_login
    return redirect_to(admin_session_path) unless session[:user_id]
  end

  def set_content_type
    headers['Content-Type'] ||= 'text/html; charset=utf-8'
  end
end
