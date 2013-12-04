class ContactController < ApplicationController

  def new
    @name = ''
    @email = ''
    @message = ''
  end

  def create
    @name = params[:name]
    @email = params[:email]
    @message = params[:message]

    if @message
      ContactMailer.contact_email(@user, @email, @message).deliver
      redirect_to(root_path, :notice => "Message was successfully sent.")
    else
      flash.now.alert = "Please fill all fields."
      render :new
    end
  end

end
