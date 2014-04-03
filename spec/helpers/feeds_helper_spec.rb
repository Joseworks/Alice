require File.dirname(__FILE__) + '/../spec_helper'

describe FeedsHelper do
  before(:each) do
    @first_date  = "2003-03-13 12:05:08"
    @second_date = "2002-03-13 12:00:00"
    @third_date  = "2001-03-29 03:39:00"
    @fourth_date = "2000-03-13 12:00:00"
    valid_feed_attributes = { :uri => "http://ny.curbed.com/atom.xml",
                              :parsed_feed => { :uri => "http://ny.curbed.com/atom.xml",
                                                :title => "CoStar Group Real Estate Bussines",
                                                :items => [{:title     =>"A nice Title",
                                                            :published => @first_date,
                                                            :link      => "http://ny.costar.com/atom.xml"
                                                          }],
                              :created_at => @first_date,
                              :updated_at => @first_date
                                              }
                            }

    more_valid_feed_attributes = {  :uri => "http://a_link.com/atom.xml",
                                    :parsed_feed => { :uri => "http://a_link.com/atom.xml",
                                                      :title => "Real Estate Deal Watch - Crain's New York Business",
                                                      :items => [{:title     =>"Another nice Title",
                                                                  :published => "",
                                                                  :link      => "http://ny.recurbed.com/atom.xml"
                                                                }],
                                    :created_at => @second_date,
                                    :updated_at => @second_date
                                                    }
                                    }

    even_more_valid_feed_attributes = {  :uri => "http://www.dnainfo.com/new-york/index/all",
                                          :parsed_feed => { :uri => "hhttp://www.dnainfo.com/new-york/index/all",
                                                            :title => "Home Page Top Stories on DNAINFO.com - Saturday, March 29, 2001 | 3:39am",
                                                            :items => [{:title     => "Home Page Top Stories on DNAINFO.com",
                                                                        :published => "",

                                                                        :link      => "http://www.dnainfo.com/new-york/index/all"
                                                                      }],
                                          :created_at => @third_date,
                                          :updated_at => @third_date
                                                          }
                                    }

    one_more_valid_feed_attributes = {  :uri => "http://generic_link_more.com/atom.xml",
                                        :parsed_feed => { :uri => "http://generic_link_more.com/atom.xml",
                                                          :title => "Generic page",
                                                          :items => [{:title     =>"Just a Generic Title",
                                                                      :published => "",
                                                                      :link      => "http://generic_generic.com/atom.xml"
                                                                    }],
                                        :created_at => @fourth_date,
                                        :updated_at => @fourth_date
                                                        }
                                        }
    yet_more_valid_feed_attributes = {  :uri => "http://link_more.com/atom.xml",
                                        :parsed_feed => { :uri => "http://link_more.com/atom.xml",
                                                          :title => "Another Generic page",
                                                          :items => [{:title     =>"Just another Generic Title",
                                                                      :published => "",
                                                                      :link      => "http://link_more.com/atom.xml"
                                                                    }],
                                        :created_at => "",
                                        :updated_at => ""
                                                        }
                                        }

      @feed_one   =  Feed.create(valid_feed_attributes)
      @feed_two   =  Feed.create(more_valid_feed_attributes)
      @feed_three =  Feed.create(even_more_valid_feed_attributes)
      @feed_four  =  Feed.create(one_more_valid_feed_attributes)
      @feed_five  =  Feed.create(yet_more_valid_feed_attributes)
      @feeds = [@feed_one, @feed_two, @feed_three, @feed_four, @feed_five]

  end

  include FeedsHelper
  describe '#shorten_names' do


    it 'assigns the feed date from name to published date for the feed' do
      @feeds = [@feed_three]
        @feeds.each do |feed|
        @feed_three[:parsed_feed][:items].each do |item|
          decoded_source_feed_name = "#{feed[:parsed_feed][:title]}".force_encoding('UTF-8')
          decoded_name = extract_date_from_title(decoded_source_feed_name, feed, item)
          expect(decoded_name).to eq(@third_date)
        end
      end
    end

    it 'assigns the feed date from created_at to published date for the feed' do
      @feeds = [@feed_four]
        @feeds.each do |feed|
        @feed_four[:parsed_feed][:items].each do |item|
          decoded_source_feed_name = "#{feed[:parsed_feed][:title]}".force_encoding('UTF-8')
          decoded_name = extract_date_from_title(decoded_source_feed_name, feed, item)
          expect(decoded_name).to eq("")
        end
      end
    end

    it 'shortens the names of CoStar Group' do
        decoded_source_feed_name = shorten_names(@feed_one[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("CoStar Group")
    end

    it 'shortens the names of Crain New York Business' do
        decoded_source_feed_name = shorten_names(@feed_two[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("Crain's New York Business")
    end


    it 'shortens the names of DNAINFO.com ' do
        decoded_source_feed_name = shorten_names(@feed_three[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("DNAINFO.com Top Stories")
    end

    it 'assigns nil if feed does not contain published date value' do
      @feed_four[:parsed_feed][:items].each do |item|
        decoded_source_feed_name = item[:title]
        assign_date_each_feed(item)
        expect(@main_feed_created_date).to eq(nil)
      end
    end

    it 'assigns nilRSS main feed does not contain a created_at date' do
      @feed_five[:parsed_feed][:items].each do |item|
        decoded_source_feed_name = item[:title]
        assign_date_each_feed(item)
        expect(@main_feed_created_date).to eq(nil)
      end
    end

    it 'assigns the current time and date to each feed if the date does not contain a published_at date' do
      @feed_four[:parsed_feed][:items].each do |item|
        decoded_source_feed_name = item[:title]
        assign_date_each_feed(item)
        expect(@feed_date).to eq(@main_feed_created_date)
      end
    end

  end

  include FeedsHelper
  describe '#sort_feeds_array' do
    it 'Sorts the array of feeds by date' do
       sort_feeds_array(@feeds)
    end
    it 'checks every feed has a published date' do
      array_sorted = sort_feeds_array(@feeds)
    end
  end

end



