require 'spec_helper'

describe Felix do
  describe 'work' do
    xit "inserts feed_posts for entries" do
      feed = Factory :feed
      fake_rss_for_url(feed.feed_url)

      Felix.new.work

      FeedPost.count.should == 10
    end
  end
end