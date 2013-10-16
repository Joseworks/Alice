require File.dirname(__FILE__) + '/../../spec_helper'

describe "/archives/index.html" do

  before(:each) do
    view.stub(:enki_config).and_return(Enki::Config.default)

    month = Struct.new(:date, :posts)
    assign :months, [
      month.new(1.month.ago.utc.beginning_of_month, [
        mock_model(Post, :title => 'Post A', :published_at => 3.weeks.ago.utc, :slug => 'post-a', :tag_list => ["Code"])
      ]),
      month.new(2.months.ago.utc.beginning_of_month, [
        mock_model(Post, :title => 'Post B', :published_at => 6.weeks.ago.utc, :slug => 'post-b', :tag_list => ["Code, Ruby"]),
        mock_model(Post, :title => 'Post C', :published_at => 7.weeks.ago.utc, :slug => 'post-c', :tag_list => [''])
      ])
    ]
  end

  after(:each) do
    rendered.should be_valid_html5_fragment
  end

  it 'renders posts grouped by month' do
    render :template => "/archives/index", :formats => [:html]
  end
end
