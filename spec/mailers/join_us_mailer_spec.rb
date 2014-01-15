require 'spec_helper'

describe JoinUsMailer do
  before(:each) do
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
  end

  describe 'join_us_email' do

    let(:mail) { JoinUsMailer.join_us_email('person', 'me@example.com', 'MESSAGE IS FROG') }


    it 'should send join us email' do
      mail.deliver
      ActionMailer::Base.deliveries.size.should == 1
    end

    it 'renders the subject' do
      mail.subject.should == 'Join us inquiry'
    end

    it 'renders the receiver email' do
      mail.to.should == ['patrick.kennedy@quidnuncre.com']
    end

    it 'renders the sender email' do
      mail.from.should == ['me@example.com']
    end

    it 'includes the @name in the email body' do
      mail.body.encoded.should include('person')
    end
  end

end