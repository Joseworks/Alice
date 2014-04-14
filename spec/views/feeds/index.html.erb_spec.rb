require 'spec_helper'
include ActionView::Helpers::UrlHelper

describe "feeds/index" do
  before(:each) do
    valid_feed_attributes = { :uri => "http://ny.curbed.com/atom.xml",
                              :parsed_feed => { :uri => "http://ny.curbed.com/atom.xml",
                                                :title => "Curbed NY",
                                                :items => [{:title     =>"A nice Title",
                                                            :published => DateTime.now,
                                                            :link      => "http://ny.curbed.com/atom.xml"}],
                                              }
                            }

    yesterday_valid_feed_attributes = { :uri => "http://ny.curbed.com/atom.xml",
                                        :parsed_feed => { :uri => "http://ny.curbed.com/atom.xml",
                                                          :title => "More Curbed NY",
                                                          :items => [{:title     =>"Another nice Title",
                                                                      :published => (1.days.ago.midnight),
                                                                      :link      => "http://ny.curbed.com/atom.xml"}],

                                                        }
                                      }

    older_valid_feed_attributes = { :uri => "http://ny.curbed.com/atom.xml",
                                        :parsed_feed => { :uri => "http://ny.curbed.com/atom.xml",
                                                          :title => "More Curbed NY",
                                                          :items => [{:title     =>"Older nice Title",
                                                                      :published => (2.days.ago),
                                                                      :link      => "http://ny.curbed.com/atom.xml"}],

                                                        }
                                      }

    very_old_valid_feed_attributes = { :uri => "http://ny.curbed.com/atom.xml",
                                        :parsed_feed => { :uri => "http://ny.curbed.com/atom.xml",
                                                          :title => "More Curbed NY",
                                                          :items => [{:title     =>"Extremely old nice Title",
                                                                      :published => (3.days.ago),
                                                                      :link      => "http://ny.curbed.com/atom.xml"}],

                                                        }
                                      }

      @feeds = [Feed.create(valid_feed_attributes), Feed.create(yesterday_valid_feed_attributes), Feed.create(older_valid_feed_attributes), Feed.create(very_old_valid_feed_attributes) ]
  end

  it 'displays a header with the current time' do
    render :template => "/feeds/index", :formats => [:html]
    rendered.should contain(DateTime.now.utc.strftime('%A, %B %e, %Y') )
  end

  it 'displays a header with yesterday time' do
    render :template => "/feeds/index", :formats => [:html]
    rendered.should contain((1.day.ago.midnight.utc).strftime('%A, %B %e, %Y') )
  end

  it 'displays a header with older feeds' do
    render :template => "/feeds/index", :formats => [:html]
    rendered.should contain("Older Feeds")
  end

  it 'displays the name of the feeds source' do
    render :template => "/feeds/index", :formats => [:html]
    rendered.should contain("Curbed NY")
  end

   it 'displays the title of the feed' do
     render :template => "/feeds/index", :formats => [:html]
     rendered.should contain("A nice Title")
   end

   it 'displays the title of the yesterday feed' do
     render :template => "/feeds/index", :formats => [:html]
     rendered.should contain("Another nice Title")
   end

   it 'displays the title of a two days older feed' do
     render :template => "/feeds/index", :formats => [:html]
     rendered.should contain("Older nice Title")
   end



   it ' does not displays the title of a three days older feed' do
     render :template => "/feeds/index", :formats => [:html]
     rendered.should_not contain("Extremely old nice Title")
   end



  it 'displays the name of the feed with a link to the feed' do
    render :template => "/feeds/index", :formats => [:html]
    rendered.should have_selector( "a", :href   => "http://ny.curbed.com/atom.xml", :target => "blank"), "A nice Title"
  end

end
