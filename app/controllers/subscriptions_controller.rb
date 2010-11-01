class SubscriptionsController < ApplicationController

  def new
    @contact = CrmContact.new
  end

  def create
    @contact = CrmContact.new(params[:crm_contact])
    @contact.save

    redirect_back_or_default('/')
    flash[:notice] = "Logged in successfully"
  end

end