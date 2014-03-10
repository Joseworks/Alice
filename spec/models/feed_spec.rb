require 'spec_helper'

describe Feed do
  before(:each) do
    def valid_feed_attributes
      { :uri => "http://www.costar.com/News/RSS/RSS.aspx?m=NYC",
        :parsed_feed => { :uri => "http://www.costar.com/News/RSS/RSS.aspx?m=NYC",
                          :title => "New York City Commercial Real Estate News From CoStar Group",
                          :items => [{:title=>"CoStar's People of Note (Mar. 2 - 8)",
                          :published => nil,
                          :link => "http://www.costar.com/News/Article/CoStars-People-of-Note-Mar-2-8/158134?ref=/News/Article/CoStars-People-of-Note-Mar-2-8/158134&src=rss"}]
                         }
      }
    end
  end

  describe Feed, 'validations' do
    it 'serialize a parsed feed' do
      feed= Feed.create(valid_feed_attributes)
      serial_feed = feed.serializable_hash
      expect(feed).to eql(serial_feed)
    end

    it 'is valid with valid_page_attributes' do
      Feed.create(valid_feed_attributes).should be_valid
    end

    it 'is invalid with no uri' do
      Feed.create(valid_feed_attributes.merge(:uri => '')).should_not be_valid
    end

    it 'is invalid with no parsed feed' do
      Feed.create(valid_feed_attributes.merge(:parsed_feed => '')).should_not be_valid
    end
  end
end

