  # - DNAInfo.com has the date for each feed included in every title, not in 'published' field
module FeedsHelper
  require 'htmlentities'

    def sort_feeds_array(feeds)
     feed_array = Array.new(4) { Array.new() }

     feeds.each do |feed|
       feed[:parsed_feed][:items].each do |item|

         decoded_source_feed_name = title_decoder("#{feed[:parsed_feed][:title]}".force_encoding('UTF-8'))

         date_published_each_feed =  assign_date_each_feed(item)

         decoded_name = shorten_names(decoded_source_feed_name)

         feed_name = title_decoder("#{item[:title]}".force_encoding('UTF-8').html_safe)

         feed_link = URI.extract("#{item[:link]}").last

         feed_array << [decoded_name, feed_name, feed_link, date_published_each_feed]
       end
     end

     feed_array.sort!  do  |x,y|
       if  x[3].nil?
         1
       elsif  y[3].nil?
         -1
       else
        y[3] <=> x[3]
      end
     end

    feed_array = feed_array.reject{ |arr| arr.all? {|elem| elem.nil? || elem.strip.empty? }}

  end

  def assign_date_each_feed(each_item)
    date_published_NYT = each_item[:pubDate]
    date_published = each_item[:published]

    if date_published.blank? && date_published_NYT.blank?
      date_published = nil
    elsif date_published.blank? && !date_published_NYT.blank?
       date_published = date_published_NYT
     else
      date_published
    end
  end

  def shorten_names(feed_title)
    if feed_title.include? "CoStar"
      decoded_source_feed_name  = "CoStar"
    elsif feed_title.include? "Crain"
      decoded_source_feed_name = "Crain's NY"
    elsif feed_title.include?("DNAINFO")
      decoded_source_feed_name = "DNA Info"
    elsif feed_title.include?("The Real Deal")
      decoded_source_feed_name = "The Real Deal"
    elsif feed_title.include?("NYT > Commercial Real Estate")
      decoded_source_feed_name = "NYT > CRE"
    elsif feed_title.include?("NYT > Real Estate")
      decoded_source_feed_name = "NYT > RE"
    elsif feed_title.include?("NY1")
      decoded_source_feed_name = "NY1-RE"
    else
      feed_title
    end
  end

  def title_decoder(title)
    coder = HTMLEntities.new
    coder.decode(title)
  end

end


