class TiplineController < ApplicationController

  def new
    @name = ''
    @email = ''
    @message = ''
  end

  def create
    @name = params[:name]
    @email = params[:email]
    @message = params[:message]

    unless @message == '' || @name == '' || @email == ''
      TiplineMailer.contact_email(@user, @email, @message).deliver
      redirect_to(root_path, :notice => "Message was successfully sent.")
    else
      flash.now.alert = "Please fill all fields."
      render :new
    end
  end

end
