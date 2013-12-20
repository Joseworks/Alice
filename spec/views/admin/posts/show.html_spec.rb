require File.dirname(__FILE__) + '/../../../spec_helper'

describe "/admin/posts/show.html" do
  after(:each) do
    rendered.should be_valid_html5_fragment
  end

  it 'should render' do
    assign :post, Post.create(
      :title        => 'A Post',
      :published_at => Time.now,
      :slug         => 'a-post',
      :body         => 'body text',
      :intro_text   => 'intro text'
    )
    render :template => '/admin/posts/show', :formats => [:html]
  end
end
