class ContactMailer < ActionMailer::Base
  default from: "noreply@quidnuncre.com"

  def contact_email(name, email, message)
    @message = message
    @name = name
    @email = email
    mail(to: 'contactqre@quidnuncre.com', subject: 'contact')
  end
end
