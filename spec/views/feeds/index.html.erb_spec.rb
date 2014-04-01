require 'spec_helper'
include ActionView::Helpers::UrlHelper

describe "feeds/index" do
  before(:each) do
    valid_feed_attributes = { :uri => "http://ny.curbed.com/atom.xml",
                              :parsed_feed => { :uri => "http://ny.curbed.com/atom.xml",
                                                :title => "Curved",
                                                :items => [{:title     =>"A nice Title",
                                                            :published => "2014-03-13 12:05:08",
                                                            :link      => "http://ny.curbed.com/atom.xml"
                                                          }],
                              :created_at => "2014-03-13 12:05:08",
                              :updated_at => "2014-03-13 12:05:08"
                                              }
                            }

      @feeds = [Feed.create(valid_feed_attributes)]
  end


  it 'displays the name of the feeds source' do
    render :template => "/feeds/index", :formats => [:html]
    rendered.should contain("Curved")
  end

   it 'displays the title of the feed' do
      render :template => "/feeds/index", :formats => [:html]
      rendered.should contain("A nice Title")
   end


  it 'displays the name of the feed with a link to the feed' do
    render :template => "/feeds/index", :formats => [:html]
    rendered.should have_selector( "a", :href   => "http://ny.curbed.com/atom.xml", :target => "blank"), "A nice Title"
  end

end


