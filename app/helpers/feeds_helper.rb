module FeedsHelper
  require 'htmlentities'
  def title_decoder(title)
    coder = HTMLEntities.new
    coder.decode(title)
  end

  def shorten_names(feed_title, feed_date, parsed_feed_published_time)
    if feed_title.include? "CoStar"
        @decoded_source_feed_name  = "CoStar Group"

    elsif feed_title.include? "Crain"
      @decoded_source_feed_name  = "Crain's New York Business"

    elsif @decoded_source_feed_name.include? "DNAINFO.com"
      @datetime = DateTime.parse(@decoded_source_feed_name)
      @decoded_source_feed_name = "DNAINFO.com Top Stories"
      @date_published_each_feed = @datetime

    else
      @date_published_each_feed = parsed_feed_published_time
      @date_published_each_feed  = feed_date if @date_published_each_feed.nil?
    end
  end

  def sort_feeds_array
    @feed_array = Array.new(4) { Array.new() }

     @feeds.each do |feed|
       @feed_date = feed.created_at || feed.published_at
       feed[:parsed_feed][:items ].each do |item|
         @decoded_source_feed_name = title_decoder("#{feed[:parsed_feed][:title]}".force_encoding('UTF-8'))
         shorten_names(@decoded_source_feed_name, @feed_date, item[:published])
         @feed_name = title_decoder("#{item[:title]}".force_encoding('UTF-8').html_safe)
         @feed_link = URI.extract("#{item[:link]}").last
         @decoded_feed_url = "#{feed[:parsed_feed][:uri]}".force_encoding('UTF-8')
         @feed_array << [@decoded_source_feed_name, @feed_name, @feed_link, @date_published_each_feed]
       end
     end

     @feed_array =  @feed_array.sort{ |x,y| y[4] <=> x[4] }
  end

end
