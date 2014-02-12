require File.dirname(__FILE__) + '/../spec_helper'

describe User, 'validations' do
  def valid_user_attributes
    { :id      => "1",
      :name    => "Don Alias",
      :email   => "don@enkiblog.com",
      :provider =>  "google_oauth2",
      :uid =>      "averylongnumber",
      :password => "apassword"
    }
  end

  it 'is valid with valid_user_attributes' do
    User.new(valid_user_attributes).should be_valid
  end

  it 'is invalid with no name' do
    User.new(valid_user_attributes.merge(:name => '')).should_not be_valid
  end

  it 'is invalid with no email' do
    User.new(valid_user_attributes.merge(:email => '')).should_not be_valid
  end

  it 'is invalid with no uid' do
    User.new(valid_user_attributes.merge(:uid => '')).should_not be_valid
  end

  it 'last_logged_in is blank until assigned' do
    User.new(valid_user_attributes).last_logged_in.should be_nil
  end

  describe 'find_for_google_oauth2' do

    it 'creates a valid user' do
      auth = OmniAuth.config.add_mock(:google_oauth2, :uid => '12345', :info => {:name => 'Joe', :email => 'joe@example.com'})
      User.find_for_google_oauth2(auth)
      user = User.last
      user.name.should == 'Joe'
      user.uid.should == '12345'
    end
  end

end
