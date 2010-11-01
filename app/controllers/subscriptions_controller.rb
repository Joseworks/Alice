class SubscriptionsController < ApplicationController

  def new
    # nothing to say yet
  end

  def create
    CrmBridge.add_contact("foo@baz.com",params[:first_name], params[:last_name])
    
    redirect_back_or_default('/')
    flash[:notice] = "Logged in successfully"
  end

end