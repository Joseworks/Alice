module FeedsHelper
  require 'htmlentities'
  def title_decoder(title)
    coder = HTMLEntities.new
    coder.decode(title)
  end

  def shorten_names(feed_title)
    if feed_title.include? "CoStar"
        @decoded_feed_title  = "CoStar Group"
    elsif feed_title.include? "Crain"
      @decoded_feed_title  = "Crain's New York Business"
    end
  end
end
