require 'spec_helper'
require File.dirname(__FILE__) + '/../../factories'


describe Admin::UsersController do

  describe 'handling GET to index' do
    before(:each) do
      @users = [mock_model(User), mock_model(User)]
      User.stub(:all).and_return(@users)
      session[:user_id] = 2
      session[:logged_in] = true
      get :index
    end

    it "is successful" do
      response.should be_success
    end

    it "renders index template" do
      response.should render_template('index')
    end

    it "finds users for the view" do
      assigns[:users].should == @users
    end
  end


end
