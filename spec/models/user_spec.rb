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

end
