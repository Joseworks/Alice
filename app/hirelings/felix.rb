#!/usr/bin/env ruby

# "Felix" inserts into the feed_posts table

class Felix < Hireling

  def work
    work_on_items_from(Feed.with_feed_url) do |feed|

      self.class.info "Pulling #{feed.title}"

      xmlfeed = Feedzirra::Feed.fetch_and_parse(
        feed.feed_url,
        { if_none_match: feed.etag }
      )

      if xmlfeed
        entries = xmlfeed.entries

        entries.each do |e|
          FeedPost.create(
            feed_id:   feed.id,
            title:     e.title,
            author:    e.author,
            url:       e.url,
            summary:   e.summary,
            content:   e.content,
            published: e.published
          )
        end

        self.class.info "Pulled #{entries.count} posts since etag #{feed.etag}."

        feed.update_attribute(:etag, xmlfeed.etag)

      else
        self.class.info "No posts for #{feed.title} since etag #{feed.etag}."

      end

    end
  end

end
