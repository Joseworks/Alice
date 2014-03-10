class FeedsController < ApplicationController

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


end
