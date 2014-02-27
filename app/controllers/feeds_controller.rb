class FeedsController < ApplicationController

  # GET /feeds
  def index
    @first_feed = SimpleRSS.parse open('http://slashdot.org/index.rdf')
    @second_feed = SimpleRSS.parse open('http://slashdot.org/index.rdf')
    @third_feed = SimpleRSS.parse open('http://gigaom.com/feed/')
    @all_feeds = [@first_feed, @second_feed, @third_feed]
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
end
