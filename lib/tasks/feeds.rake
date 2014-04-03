namespace :rss do
  desc "Refresh RSS feeds"
    task :refresh_feeds => :environment do

      @all_feeds = AppConfig.feeds.map do |uri|
        feed = SimpleRSS.parse open( uri, :read_timeout=>15 )
        { :uri => uri, :title => feed.title,
          :items => feed.items.map{ |item|
          {:title => item.title, :published => item.published, :link => item.link} } }
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
