require File.dirname(__FILE__) + '/../../spec_helper'

describe Admin::SessionsController do
  describe 'handling GET to show (default)' do
    it 'redirects to new' do
      get :show
      response.should be_redirect
      response.should redirect_to(new_admin_session_path)
    end
  end

  describe 'handling GET to new' do
    before(:each) do
      get :new
    end

    it "should be successful" do
      response.should be_success
    end

    it "should render index template" do
      response.should render_template('new')
    end
  end

  describe 'handling DELETE to destroy' do
    before(:each) do
      delete :destroy
    end

    it 'logs out the current session' do
      session[:logged_in].should == nil
    end

    it 'redirects to /' do
      response.should be_redirect
      response.should redirect_to('/')
    end
  end

  describe '#allow_login_bypass? when RAILS_ENV == production' do
    it 'returns false' do
      ::Rails.stub(:env).and_return('production')
      @controller.send(:allow_login_bypass?).should == false
    end
  end
end

shared_examples_for "logged in and redirected to /admin" do
  it "should set session[:logged_in]" do
    session[:logged_in].should be_true
  end
  it "should redirect to admin posts" do
    response.should be_redirect
    response.should redirect_to('/admin')
  end
end
shared_examples_for "not logged in" do
  it "should not set session[:logged_in]" do
    session[:logged_in].should be_nil
  end
  it "should render new" do
    response.should be_success
    response.should render_template("new")
  end
  it "should set flash.now[:error]" do
    flash.now[:error].should_not be_nil
  end
end

describe Admin::SessionsController, "handling CREATE with post" do
  before do
    @controller.instance_eval { flash.extend(DisableFlashSweeping) }
  end

  describe "with bypass login selected" do
    before do
      User.stub(:first).and_return(User.new)
      post :create, :bypass_login => "1"
    end
    it_should_behave_like "logged in and redirected to /admin"
  end
  # describe "with bypass login selected but login bypassing disabled" do
  #   before do
  #     User.stub(:first).and_return(User.new)
  #     @controller.stub(:allow_login_bypass?).and_return(false)
  #     post :create, :openid_url => "", :bypass_login => "1"
  #   end
  #   it_should_behave_like "not logged in"
  # end
end
