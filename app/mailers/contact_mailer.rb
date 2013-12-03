class ContactMailer < ActionMailer::Base
  default from: "contact-form@quidnuncre.com"

  def contact_email(message)
    @message = message
    mail(to: 'patrick.kennedy@quidnuncre.com', subject: 'contact')
  end
end
