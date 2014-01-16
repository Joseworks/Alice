require File.dirname(__FILE__) + '/../spec_helper'

describe User, 'validations' do
  def valid_user_attributes
    {
      :name    => "Don Alias",
      :email   => "don@enkiblog.com",
      :provider =>  "google_oauth2",
      :uid =>      "averylongnumber"
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

  describe 'create_with_omniauth' do

    it 'creates a valid user' do
      auth = {"provider" => 'google_oauth2', "uid" => 19827348, 'info' => {"name" => 'frog', "email" => 'frog@example.com'}}
      User.create_with_omniauth(auth)
      user = User.last
      user.name.should == 'frog'
      user.uid.should == '19827348'
    end

  end

end
