class ContactController < ApplicationController

  def new
    @message = ''
  end

  def create
    @message = params[:message]

    if @message
      ContactMailer.contact_email(@message).deliver
      redirect_to(root_path, :notice => "Message was successfully sent.")
    else
      flash.now.alert = "Please fill all fields."
      render :new
    end
  end

end
