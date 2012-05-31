class Feed < ActiveRecord::Base
  validates_presence_of :title, :feed_url

  scope :with_feed_url, :conditions => ["feed_url is not null"]

end