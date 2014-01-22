require 'spec_helper'

describe ContactMailer do
  before(:each) do
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
  end

  describe 'contact_email' do

    let(:mail) { ContactMailer.contact_email('person', 'me@example.com', 'MESSAGE IS FROG') }


    it 'should send contact email' do
      mail.deliver
      ActionMailer::Base.deliveries.size.should == 1
    end

    it 'renders the subject' do
      mail.subject.should == 'contact'
    end

    it 'renders the receiver email' do
      mail.to.should == ['contactqre@quidnuncre.com']
    end

    it 'renders the sender email' do
      mail.from.should == ['noreply@quidnuncre.com']
    end

    it 'includes the @name in the email body' do
      mail.body.encoded.should include('person')
    end
  end

end