class JoinUsMailer < ActionMailer::Base
  default from: "noreply@quidnuncre.com"

  def join_us_email(name, email, message)
    @message = message
    @name = name
    @email = email
    mail(to: 'josequidnuncre@gmail.com', subject: 'Join us inquiry', from: @email)
  end
end
