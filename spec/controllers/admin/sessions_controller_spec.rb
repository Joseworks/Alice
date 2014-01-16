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

  describe "logging attempt regardless of success" do
    it "updates the last_logged_in" do
      time_before = Time.now - 5.minutes
      user = User.create(:name    => "Don Alias",
              :email   => "testuser@quidnuncre.com",
              :provider =>  "google_oauth2",
              :uid =>      "averylongnumber",
              :last_logged_in => time_before)
      request.env["omniauth.auth"] = OmniAuth.config.add_mock(:google,
                                                   { uid: 'averylongnumber', info:  {
                                                     email: 'testuser@quidnuncre.com' }})


      post :create
      user.reload
      user.last_logged_in.should_not == time_before
    end
  end

  describe "with valid openid credentials" do
    before do
    request.env["omniauth.auth"] = OmniAuth.config.add_mock(:google,
                                                   { uid: '123545', info:  {
                                                     email: 'testuser@quidnuncre.com' }})
      post :create
    end
    it_should_behave_like "logged in and redirected to /admin"
  end

  describe "invalid login" do
    before do
    request.env["omniauth.auth"] = OmniAuth.config.add_mock(:google,
                                                   { uid: '123545', info:  {
                                                     email: 'testuser@example.com' }})
      post :create
    end
    it_should_behave_like "not logged in"
  end
end
