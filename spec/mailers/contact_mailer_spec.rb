require 'spec_helper'

describe ContactMailer do
  describe 'contact_email' do
    let(:mail) { ContactMailer.contact_email('person', 'me@example.com', 'MESSAGE IS FROG') }

    it 'renders the subject' do
      mail.subject.should == 'contact'
    end

    it 'renders the receiver email' do
      mail.to.should == ['patrick.kennedy@quidnuncre.com']
    end

    it 'renders the sender email' do
      mail.from.should == ['noreply@quidnuncre.com']
    end

    it 'includes the @name in the email body' do
      mail.body.encoded.should include('person')
    end
  end

  pending describe 'tip_email' do

  end
end