class SubscriptionsController < ApplicationController

  def new
    # nothing to say yet
  end

  def create
    redirect_back_or_default('/')
    flash[:notice] = "Logged in successfully"
  end

end