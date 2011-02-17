class SubscriptionsController < ApplicationController

  def new
    @contact = CrmContact.new
  end

  def create
    @contact = CrmContact.new(params[:crm_contact])
    @contact.save
    success = @contact && @contact.save
    
    if (success)
      redirect_back_or_default('/')
      flash[:notice] = "Logged in successfully"
    else
      flash[:error] = "WTF"
      render :action => 'new'
    end
  end

end