class FeedsController < ApplicationController
before_filter :feeds, :only => :index

  # GET /feeds
  def index
    respond_to do |format|
      format.html
      format.atom { render layout: false }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_feed
      @feed = Feed.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def feed_params
      params[:feed]
    end

    def feeds
      @first_feed  = SimpleRSS.parse open('http://feeds.feedburner.com/trdnews?format=xml')
      @second_feed = SimpleRSS.parse open('http://ny.curbed.com/atom.xml')
      @third_feed  = SimpleRSS.parse open('http://www.dnainfo.com/new-york/index/all')
      @fourth_feed = SimpleRSS.parse open('http://feeds.crainsnewyork.com/crainsnewyork/deals')
      @fifth_feed  = SimpleRSS.parse open('http://feeds.feedburner.com/inmannews?format=xml')
      @sixth_feed  = SimpleRSS.parse open('http://www.ny1.com/Rss/Feeds.aspx?SecID=20090&RegionCookie=1')
      @seventh_feed = SimpleRSS.parse open('http://rss.nytimes.com/services/xml/rss/nyt/RealEstate.xml')
      @eighth_feed = SimpleRSS.parse open('http://rss.nytimes.com/services/xml/rss/nyt/Commercial.xml')
      @ninth_feed = SimpleRSS.parse open('http://www.costar.com/News/RSS/RSS.aspx?m=NYC')

      @all_feeds = [@first_feed, @second_feed, @third_feed, @fourth_feed, @fifth_feed,
                    @sixth_feed, @seventh_feed,@eighth_feed, @ninth_feed]
    end

end
