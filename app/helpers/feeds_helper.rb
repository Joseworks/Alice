  # - DNAInfo.com has the date for each feed included in every title, not in 'published' field
module FeedsHelper
  require 'htmlentities'

    def sort_feeds_array(feeds)
     feed_array = Array.new(4) { Array.new() }

     feeds.each do |feed|

       feed[:parsed_feed][:items].each do |item|

         if feed[:parsed_feed][:title].include? "DNAINFO.com"
           decoded_source_feed_name ="#{feed[:parsed_feed][:title]}".force_encoding('UTF-8')
         else
           decoded_source_feed_name = title_decoder("#{feed[:parsed_feed][:title]}".force_encoding('UTF-8'))
         end

         shorten_names(decoded_source_feed_name)

         feed_name = title_decoder("#{item[:title]}".force_encoding('UTF-8').html_safe)

         extract_date_from_title(feed_name)

         shorten_name_for_dna_feed(decoded_source_feed_name)

         read_date_from_main_feed(feed, item)

         assign_date_each_feed(item)

         feed_link = URI.extract("#{item[:link]}").last

        feed_array << [decoded_source_feed_name, feed_name, feed_link, @date_published_each_feed]
       end
     end

    feed_array.sort{ |x,y| (  (y[3].nil? || x[3].nil?)  ?  3 :  (x[3] <=> y[3])  ) }

    # feed_array.sort_by(&:published_at) DV Note :)
  end

  def title_decoder(title)
    coder = HTMLEntities.new
    coder.decode(title)
  end

  def shorten_names(feed_title)
    if feed_title.include? "CoStar Group Real"
      decoded_source_feed_name  = "CoStar Group"
    elsif feed_title.include? "Crain"
      decoded_source_feed_name  = "Crain's New York Business"
    else
      decoded_source_feed_name = feed_title
    end
  end

  def extract_date_from_title(feed_name)
    if feed_name.include?("DNAINFO")
      @date_published_each_feed = DateTime.parse(feed_name, "%Y-%m-%d %H:%M").to_datetime
    else
      @date_published_each_feed
    end
  end

  def shorten_name_for_dna_feed(feed_name)
    if feed_name.include?("DNAINFO")
      decoded_source_feed_name = "DNAINFO.com Top Stories"
    else
      decoded_source_feed_name
    end
  end

  def read_date_from_main_feed(each_feed, each_item)
    @main_feed_created_date = each_feed[:parsed_feed][:created_at]
    if @main_feed_created_date.blank?
      @main_feed_created_date = (DateTime.now).to_s
    end
  end

  def assign_date_each_feed(each_item)
    @feed_date = each_item[:published]
    if feed_date_blank?
      @date_published_each_feed = @feed_date = @main_feed_created_date
    end
  end

  def feed_date_blank?
    @feed_date.blank?
  end

end


