require File.dirname(__FILE__) + '/../spec_helper'

describe FeedsHelper do
  before(:each) do
    valid_feed_attributes = { :uri => "http://ny.curbed.com/atom.xml",
                              :parsed_feed => { :uri => "http://ny.curbed.com/atom.xml",
                                                :title => "CoStar Group Real Estate Bussines",
                                                :items => [{:title     =>"A nice Title",
                                                            :published => "2014-03-13 12:05:08",
                                                            :link      => "http://ny.curbed.com/atom.xml"
                                                          }],
                              :created_at => "2014-03-13 12:05:08",
                              :updated_at => "2014-03-13 12:05:08"
                                              }
                            }

    more_valid_feed_attributes = {  :uri => "http://a_link.com/atom.xml",
                                    :parsed_feed => { :uri => "http://a_link.com/atom.xml",
                                                      :title => "Real Estate Deal Watch - Crain's New York Business",
                                                      :items => [{:title     =>"Another nice Title, but created before",
                                                                  :published => "2014-03-13 12:00:08",
                                                                  :link      => "http://ny.recurbed.com/atom.xml"
                                                                }],
                                    :created_at => "2014-03-13 12:00:08",
                                    :updated_at => "2014-03-13 12:00:08"
                                                    }
                                    }
      @feed_one =  Feed.create(valid_feed_attributes)
      @feed_two =  Feed.create(more_valid_feed_attributes)
      @feeds = [@feed_one, @feed_two]
  end

  include FeedsHelper
  describe '#shorten_names' do
    it 'shortens the names of CoStar Group' do
      @feed_date = @feed_one.created_at || @feed_one.published_at

      @feed_one[:parsed_feed][:items].each do |item|
        @decoded_source_feed_name = title_decoder("#{@feed_one[:parsed_feed][:title]}".force_encoding('UTF-8')).inspect
        shorten_names(@decoded_source_feed_name, @feed_date, item[:published])
        expect(@decoded_source_feed_name).to eq("CoStar Group")
      end
    end

    it 'shortens the names of Crain New York Business' do
      @feed_date = @feed_two.created_at || @feed_two.published_at

      @feed_two[:parsed_feed][:items].each do |item|
        @decoded_source_feed_name = title_decoder("#{@feed_two[:parsed_feed][:title]}".force_encoding('UTF-8')).inspect
        shorten_names(@decoded_source_feed_name, @feed_date, item[:published])
        expect(@decoded_source_feed_name).to eq("Crain's New York Business")
      end
     end
  end

end
