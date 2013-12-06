class TiplineMailer < ActionMailer::Base
  default from: "tips@quidnuncre.com"

  def tipline_email(name, email, message)
    @message = message
    @name = name
    @email = email
    mail(to: 'newnewsqre@quidnuncre.com', subject: 'incoming tip')
  end
end
