class CreateFeeds < ActiveRecord::Migration
  def self.up
    create_table :feeds do |t|
      t.string     :title
      t.string     :etag
      t.string     :url
      t.string     :feed_url
   end

    create_table :feed_posts do |t|
      t.integer    :feed_id
      t.string     :title
      t.string     :url
      t.string     :author
      t.text       :summary
      t.text       :content
      t.datetime   :published
      t.timestamps
    end
  end

  def self.down
    drop_table :feed_posts
    drop_table :feeds
  end

end
