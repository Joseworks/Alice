require 'spec_helper'

describe FeedsController do

  describe "GET index" do
    before (:each) do
      @first_feed = {:title=>"Kepler's Alien World Count Skyrockets",
              :link=>"http://rss.slashdot.org/~r/Slashdot/slashdot/to/~3/Opg2H9HUTIo/keplers-alien-world-count-skyrockets",
              :description=>"&lt;img src=\"http://feeds.feedburner.com/~r/Slashdot/slashdot/to/~4/Opg2H9HUTIo\" height=\"1\" width=\"1\"/&gt;",
              :feedburner_origLink=>"http://science.slashdot.org/story/14/02/26/2025231/keplers-alien-world-count-skyrockets?utm_source=rss0.9mainlinkanon&amp;utm_medium=feed"}

      SimpleRSS.stub(:parse).and_return(@first_feed)
      get :index
    end
    it "should be successful" do

      response.should be_success
    end

    it "should render index template" do

      response.should render_template('index')
    end

    it "should return a feed" do
      assigns(:all_feeds).should include(@first_feed)
    end
  end
end
