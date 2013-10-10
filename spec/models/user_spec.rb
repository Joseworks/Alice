require File.dirname(__FILE__) + '/../spec_helper'

describe User, 'validations' do
  def valid_user_attributes
    {
      :name    => "Don Alias",
      :email   => "don@enkiblog.com",
      :openid_url => "http://enkiblog.com"
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

  it 'is invalid with no openid' do
    User.new(valid_user_attributes.merge(:openid_url => nil)).should_not be_valid
  end
  it 'is invalid with a blank openid' do
    User.new(valid_user_attributes.merge(:openid_url => '')).should_not be_valid
  end
  it 'is invalid without a HTTP or HTTPS openid' do
    User.new(valid_user_attributes.merge(:openid_url => 'something.com')).should_not be_valid
    User.new(valid_user_attributes.merge(:openid_url => 'ftp://something.com')).should_not be_valid
  end
end

describe 'User', 'openid' do
  before(:each) do
    @User = User.new
  end
  it 'can be set with a URI string representation' do
    @User.openid_url = "http://enkiblog.com"
    @User.openid_url.should eql(URI.parse("http://enkiblog.com"))
  end
  it 'can be set with a URI' do
    @User.openid_url = URI.parse("http://enkiblog.com")
    @User.openid_url.should eql(URI.parse("http://enkiblog.com"))
  end
end

describe 'User', 'with_openid' do
  before(:each) do
    @User = User.create! :name => "Don Alias",
                             :email  => "don@enkiblog.com",
                             :openid_url  => "http://enkiblog.com"

  end
  it "should return the User with matching openid" do
    User.with_openid_url("http://enkiblog.com").should eql(@User)
  end
  it "should return nil if there's no User with matching openid" do
    User.with_openid_url("http://somesite.com").should be_nil
  end
end