namespace :rss do
  desc "Refresh RSS feeds"
    task :refresh_feeds => :environment do

      @all_feeds = AppConfig.feeds.map do |uri|
        feed = SimpleRSS.parse open( uri, :read_timeout=>15 )
        { :uri => uri, :title => feed.title,
          :items => feed.items.map{ |item|
          {:title => item.title, :published => item.published, :pubDate => item.pubDate, :link => item.link} } }
      end

      @all_feeds.each do |feed|
        feed[:items].each do |item|
          if !item[:published].nil?
            item[:published] = item[:published].utc
          elsif !item[:pubDate].nil?
            item[:pubDate] =  item[:pubDate].utc
          end

        if feed[:title].include? "DNAINFO.com"
          dna_title = feed[:title]
          item[:published] = DateTime.parse(dna_title)
          item[:published] =item[:published].utc
        end
          if item[:published].nil? && item[:pubDate].nil?
            p " ->  #{item[:title]} ----- #{item[:published] }  --  #{item[:pubDate] } "
          end
        end
      end


      @all_feeds.each do |feed|
        new = Feed.find_or_initialize_by_uri( feed[:uri] )
        new.parsed_feed = feed
        new.save!
      end

    end


  desc "Cleans out all feeds"
  task :clean_feeds => :environment do
    Feed.delete_all
  end

end
