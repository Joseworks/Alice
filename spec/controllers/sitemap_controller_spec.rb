require File.dirname(__FILE__) + '/../spec_helper'


describe SitemapController do


  context 'handling GET to index'do
    before(:each) { @posts = [FactoryGirl.create(:post)] }

    def do_get
      get :index, format: 'xml'
    end

    it "should be successful" do
      do_get
      response.should be_success
    end

    it "should render index template" do
      do_get
      response.should render_template('sitemap/index')
      response.content_type.should == 'application/xml'
    end

    it "should assign the found posts for the view" do
      do_get
      assigns[:posts].should == @posts
    end

    it "should find posts" do
      now = Time.now
      Time.stub(:now).and_return(now)

      Post.should_receive(:find).with(        :all,
        order:      'posts.published_at DESC',
        conditions: ['published_at < ?', Time.now]
      ).and_return(@posts)
      do_get
    end
  end

end
