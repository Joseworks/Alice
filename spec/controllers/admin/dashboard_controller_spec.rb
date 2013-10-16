require File.dirname(__FILE__) + '/../../spec_helper'

describe Admin::DashboardController do
  describe 'handling GET to show' do
    before(:each) do
      @posts    = [mock_model(Post), mock_model(Post)]
      @comment_activity = [double("comment-1"), double("comment-2")]
      Post.stub(:find_recent).and_return(@posts)
      Stats.stub(:new).and_return(@stats = Struct.new(:post_count, :comment_count, :tag_count).new(3,2,1))

      session[:user_id] = 2
      session[:logged_in] = true
      get :show
    end

    it "is successful" do
      response.should be_success
    end

    it "renders show template" do
      response.should render_template('show')
    end

    it "finds posts for the view" do
      assigns[:posts].should == @posts
    end

    it "assigns stats for the view" do
      assigns[:stats].should == @stats
    end
  end
end
