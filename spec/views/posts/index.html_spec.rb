require File.dirname(__FILE__) + '/../../spec_helper'

describe "/posts/index.html" do
  before(:each) do
    view.stub(:enki_config).and_return(Enki::Config.default)

    mock_post = [mock_model(Post,
      :title             => "A post",
      :body_html         => "Posts contents!",
      :published_at      => 1.year.ago,
      :published?        => true,
      :slug              => 'a-post',
      :tag_list          => ['code'],
      :image             => nil
    )]

    mock_post.stub(:total_pages).and_return(1)
    assign :posts, mock_post
  end

  after(:each) do
    rendered.should be_valid_html5_fragment
  end

  it "should render list of posts" do
    render :template => "/posts/index", :formats => [:html]
  end

  it "should render list of posts with a tag" do
    assigns[:tag] = 'code'
    render :template => "/posts/index", :formats => [:html]
  end
end
