require 'spec_helper'

describe FeedsController do

  describe "GET index without feeds" do
    render_views
    it "should display a message if there are no feeds" do
      @first_feed = {}
      get :index
      @first_feed[:parsed_feed].should be_nil
      response.should contain("There are no feeds yet. We will update soon.")
    end
  end

  describe "GET index" do
    before (:each) do
      @first_feed = Feed.create(new_feed_attributes)
      get :index
    end

    it "should be successful" do
      response.should be_success
    end

    it "should render index template" do
      response.should render_template('index')
    end

    it "should return a feed" do
      assigns(:feeds).should_not be_nil
    end

    it "should return a feed including parsed feed" do
      @first_feed[:parsed_feed].should eql(new_feed_attributes[:parsed_feed])
    end
  end

  def new_feed_attributes
    { uri: "uri", parsed_feed:{ title: "A title", published: "On time", link: "Yet another link" }}
  end
end
