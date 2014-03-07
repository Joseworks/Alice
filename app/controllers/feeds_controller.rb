class FeedsController < ApplicationController
# before_filter :feeds, :only => :index

  # GET /feeds
  def index
    @feeds = Feed.all
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
      @all_feeds = AppConfig.feeds.map do |uri|
        feed = SimpleRSS.parse open( uri )
        { :uri => uri, :title => feed.title,
          :items => feed.items.map{ |item|
          {:title => item.title, :published => item.published, :link => item.link} } }
      end

      @all_feeds.each { |feed|
          new = Feed.find_or_initialize_by_uri( feed[:uri] )
          new.parsed_feed = feed
          new.save!
        }
      end


end
