require File.dirname(__FILE__) + '/../spec_helper'

describe FeedsHelper do
  before(:each) do
    create_feeds_for_testing
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
        expect(decoded_source_feed_name).to eq("CoStar")
    end

    it 'shortens the names of Crain New York Business' do
        decoded_source_feed_name = shorten_names(@feed_two[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("Crain's NY")
    end

    it 'shortens the names of DNAINFO.com ' do
        decoded_source_feed_name = shorten_names(@feed_three[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("DNA Info")
    end

    it 'shortens the names of The Real Deal New York ' do
        decoded_source_feed_name = shorten_names(@feed_four[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("The Real Deal")
    end

    it 'shortens the names of NYT > Commercial Real Estate' do
        decoded_source_feed_name = shorten_names(@feed_five[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("NYT > CRE")
    end

    it 'shortens the names of NYT > Real Estate' do
        decoded_source_feed_name = shorten_names(@feed_six[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("NYT > RE")
    end

    it 'shortens the names of Real Estate - NY1' do
        decoded_source_feed_name = shorten_names(@feed_seven[:parsed_feed][:title])
        expect(decoded_source_feed_name).to eq("NY1-RE")
    end

    it 'assigns nil if feed does not contain published date value' do
      @feed_four[:parsed_feed][:items].each do |item|
        decoded_source_feed_name = item[:title]
        assign_date_each_feed(item)
        expect(@main_feed_created_date).to eq(nil)
      end

    end


  end

  include FeedsHelper
  describe '#sort_feeds_array' do
    before (:each) do
      @feed_five[:parsed_feed][:title] = shorten_names(@feed_five[:parsed_feed][:title])
      @feed_six[:parsed_feed][:title] = shorten_names(@feed_six[:parsed_feed][:title])
      @feeds = [@feed_six, @feed_five]
      @sorted_feeds = [[@feed_six[:parsed_feed][:title], @feed_six[:parsed_feed][:items][0][:title], "http://link", @sixth_date],
                       [@feed_five[:parsed_feed][:title], @feed_five[:parsed_feed][:items][0][:title], "http://link", @fifth_date]]
    end
    it 'Sorts the array of feeds by date' do
      expect(sort_feeds_array(@feeds)).to eq(@sorted_feeds)
    end
  end

  def create_feeds_for_testing
    @first_date  = "2003-03-13 12:05:08"
    @second_date = "2002-03-13 12:00:00"
    @third_date  = "2001-03-29 03:39:00"
    @fourth_date = "2000-03-13 12:00:00"
    @fifth_date = "2000-03-13 12:00:00"
    @sixth_date = "2000-03-14 12:00:00"
    @seven_date = "2000-03-12 12:00:00"
    valid_feed_1_attributes = { :uri => "http://ny.curbed.com/atom.xml",
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

    valid_feed_2_attributes = {  :uri => "http://a_link.com/atom.xml",
                                    :parsed_feed => { :uri => "http://a_link.com/atom.xml",
                                                      :title => "Real Estate Deal Watch - Crain's New York Business",
                                                      :items => [{:title     =>"Another nice Title",
                                                                  :published => @second_date,
                                                                  :link      => "http://ny.recurbed.com/atom.xml"
                                                                }],
                                    :created_at => @second_date,
                                    :updated_at => @second_date
                                                    }
                                    }

    valid_feed_3_attributes = {  :uri => "http://www.dnainfo.com/new-york/index/all",
                                          :parsed_feed => { :uri => "hhttp://www.dnainfo.com/new-york/index/all",
                                                            :title => "Home Page Top Stories on DNAINFO.com - Saturday, March 29, 2001 | 3:39am",
                                                            :items => [{:title     => "Home Page Top Stories on DNAINFO.com",
                                                                        :published => @third_date,
                                                                        :link      => "http://www.dnainfo.com/new-york/index/all"
                                                                      }],
                                          :created_at => @third_date,
                                          :updated_at => @third_date
                                                          }
                                    }

    valid_feed_4_attributes = {  :uri => "http://generic_link_more.com/atom.xml",
                                        :parsed_feed => { :uri => "http://generic_link_more.com/atom.xml",
                                                          :title => "The Real Deal New York ",
                                                          :items => [{:title     =>"Just a Generic Title",
                                                                      :published => "",
                                                                      :link      => "http://generic_generic.com/atom.xml"
                                                                    }],
                                        :created_at => @fourth_date,
                                        :updated_at => @fourth_date
                                                        }
                                        }
      valid_feed_5_attributes = {  :uri => "http://link_more.com/atom.xml",
                                          :parsed_feed => { :uri => "http://link_more.com/atom.xml",
                                                            :title => "NYT > Commercial Real Estate",
                                                            :items => [{:title     =>"Just another Generic Title",
                                                                        :published => @fifth_date,
                                                                        :link      => "http://link_more.com/atom.xml"
                                                                      }],
                                          :created_at => @fifth_date,
                                          :updated_at => @fifth_date
                                                          }
                                          }

      valid_feed_6_attributes = {  :uri => "http://link_more.com/atom.xml",
                                          :parsed_feed => { :uri => "http://link_more.com/atom.xml",
                                                            :title => "NYT > Real Estate",
                                                            :items => [{:title     =>"Just another Title",
                                                                        :published => @sixth_date,
                                                                        :link      => "http://link_more.com/atom.xml"
                                                                      }],
                                          :created_at => @sixth_date,

                                                          }
                                          }

      valid_feed_7_attributes = {  :uri => "http://link_more.com/atom.xml",
                                          :parsed_feed => { :uri => "http://link_more.com/atom.xml",
                                                            :title => "NY1 Time Warner Cable NewsReal Estate",
                                                            :items => [{:title     =>"Just another Title",
                                                                        :published => @seventh_date,
                                                                        :link      => "http://link_more.com/atom.xml"
                                                                      }],
                                          :created_at => @sixth_date,

                                                          }
                                          }
      @feed_one   =  Feed.create(valid_feed_1_attributes)
      @feed_two   =  Feed.create(valid_feed_2_attributes)
      @feed_three =  Feed.create(valid_feed_3_attributes)
      @feed_four  =  Feed.create(valid_feed_4_attributes)
      @feed_five  =  Feed.create(valid_feed_5_attributes)
      @feed_six   =  Feed.create(valid_feed_6_attributes)
      @feed_seven =  Feed.create(valid_feed_7_attributes)

      @feeds = [@feed_one, @feed_two, @feed_three, @feed_four, @feed_five]
  end

end
