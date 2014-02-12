require File.dirname(__FILE__) + '/../spec_helper'
include Devise::TestHelpers

describe OmniauthCallbacksController do
  it "should sign in page and display a message after successful log in " do
    request.env["devise.mapping"] = Devise.mappings[:user]
    current_user = FactoryGirl.create(:user)
    sign_in current_user
    request.env["omniauth.auth"] = OmniAuth.config.add_mock(:google_oauth2, :uid => current_user.uid, :info => {:name => current_user.name, :email => current_user.email })
    get :google_oauth2
    flash[:notice].should contain  'Successfully authenticated from Google account'
  end

  it "should redirect to sign in not successful" do
    request.env["devise.mapping"] = Devise.mappings[:user]
    current_user = User.create({ :id      => "1",
      :name    => "a name",
      :email   => "email@domain.com",
      :provider =>  "google_oauth2",
      :uid =>      "",
      :password => "apassword"
    })
    sign_in current_user
    request.env["omniauth.auth"] = OmniAuth.config.add_mock(:google_oauth2, :uid => current_user.uid, :info => {:name => current_user.name, :email => current_user.email })
    get :google_oauth2
    response.should redirect_to new_user_session_url
  end
end
