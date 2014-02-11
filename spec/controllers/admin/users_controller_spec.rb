require 'spec_helper'

describe Admin::UsersController do

  describe 'handling GET to index' do
    before(:each) do
      @user = FactoryGirl.create(:user)
      sign_in @user
      get :index
    end

    it "is successful" do
      response.should be_success
    end

    it "renders index template" do
      response.should render_template('index')
    end

    it "finds users for the view" do
      users = build_list(:user, 5)
      assigns[:users].should include(@user)
    end
  end

end
