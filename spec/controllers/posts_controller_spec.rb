require File.dirname(__FILE__) + '/../spec_helper'

shared_examples_for 'successful posts list' do
  it "should be successful" do
    do_get
    response.should be_success
  end

  it "should render index template" do
    do_get
    response.should render_template('index')
  end

  it "should assign the found posts for the view" do
    do_get
    assigns[:posts].should == @posts
  end
end

shared_examples_for "ATOM feed" do
  it "renders with no layout" do
    response.should render_template(nil)
  end
end

describe PostsController do
  let(:posts) {[mock_model(Post)]}

  before(:each) do
    Post.stub(:find_recent).and_return(@posts)
  end

  context 'handling GET to index'do

    def do_get
      get :index
    end

    it_should_behave_like('successful posts list')

    it "should find recent posts" do
      Post.should_receive(:find_recent).with(tag: nil, include: :tags, page: nil).and_return(@posts)
      do_get
    end
  end

  context 'handling GET to index with tag'do

    def do_get
      get :index, tag: 'code'
    end

    it_should_behave_like('successful posts list')

    it "should find recent tagged posts" do
      Post.should_receive(:find_recent).with(tag: 'code', include: :tags, page: nil).and_return(@posts)
      do_get
    end
  end

  describe 'handling GET to index with no posts' do
    before(:each) do
      posts = []
    end

    def do_get
      get :index
    end

    it_should_behave_like('successful posts list')
  end

  context 'handling GET to index with invalid tag'do
    it "shows post not found" do
      # This would normally 404, except the way future dated posts are handled
      # means it is possible for a tag to exist (and show up in the navigation)
      # without having any public posts. If that issue is ever fixed, this
      # behaviour should revert to 404ing.
      Post.stub(:find_recent).and_return([])
      get :index, tag: 'bogus'
      assigns(:posts).should be_empty
    end
  end

  context 'handling GET to /posts.atom'do

    def do_get
      @request.env["HTTP_ACCEPT"] = "application/atom+xml"
      get :index
    end

    it_should_behave_like('successful posts list')
    it_should_behave_like('ATOM feed')

    it "should find recent posts" do
      Post.should_receive(:find_recent).with(tag: nil, include: :tags, page: nil).and_return(@posts)
      do_get
    end
  end

  context 'handling GET to /posts.atom with tag'do

    def do_get
      @request.env["HTTP_ACCEPT"] = "application/atom+xml"
      get :index, tag: 'code'
    end

    it_should_behave_like('successful posts list')
    it_should_behave_like('ATOM feed')

    it "should find recent posts" do
      Post.should_receive(:find_recent).with(tag: 'code', include: :tags, page: nil).and_return(@posts)
      do_get
    end
  end

  context "handling GET for a single post" do
    let(:post) { FactoryGirl.create(:post)}
    before(:each) do
      Post.stub(:find_by_permalink).and_return(post)
    end

    def do_get
      get :show, year: '2014', month: '01', day: '01', slug: 'my-manually-entered-slug'
    end

    it "should be successful" do
      do_get
      response.should be_success
    end

    it "should render show template" do
      do_get
      response.should render_template('show')
    end

    it "should find the post requested" do
      Post.find_by_permalink('2008', '01', '01', 'a-post', include: [:tags])
      do_get
    end

    it "should assign the found post for the view" do
      do_get
      assigns[:post].should equal(post)
    end

    it "should increment the impressions count" do
      do_get
      post.reload
      post.impressions_count.should > 0
    end

    it "should route /pages to posts#index with tag pages" do
      {get: "/pages"}.should route_to(controller: 'posts', action: 'index', tag: 'pages')
    end
  end
end
