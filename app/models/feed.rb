class Feed < ActiveRecord::Base
  validates_presence_of :uri, :parsed_feed
  serialize :parsed_feed, Hash
end
