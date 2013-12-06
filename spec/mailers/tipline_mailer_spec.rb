require 'spec_helper'

describe TiplineMailer do
  before(:each) do
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
  end

  describe 'contact_email' do

    let(:mail) { TiplineMailer.tipline_email('person', 'me@example.com', 'MESSAGE IS FROG') }


    it 'should send contact email' do
      mail.deliver
      ActionMailer::Base.deliveries.size.should == 1
    end

    it 'renders the subject' do
      mail.subject.should == 'incoming tip'
    end

    it 'renders the receiver email' do
      mail.to.should == ['newnewsqre@quidnuncre.com']
    end

    it 'renders the sender email' do
      mail.from.should == ['tips@quidnuncre.com']
    end

    it 'includes the @name in the email body' do
      mail.body.encoded.should include('person')
    end
  end

end
