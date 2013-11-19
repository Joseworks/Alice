require File.dirname(__FILE__) + '/../../spec_helper'

describe "/posts/show.html" do
  include UrlHelper

  before(:each) do
    view.stub(:enki_config).and_return(Enki::Config.default)

    @post = mock_model(Post,
      title:             "A post",
      body_html:         "Posts contents!",
      published_at:      1.year.ago,
      published?:        true,
      updated?:          false,
      slug:              'a-post',
      tag_list:          ['code'],
      image:             nil,
      source_link:       '',
      previous_post:     '',
      next_post:         ''
    )
    assign :post, @post
  end

  after(:each) do
    rendered.should be_valid_html5_fragment
  end

  it "should render a post" do
    render :template => "/posts/show", :formats => [:html]
  end
end
