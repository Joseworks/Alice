require 'spec_helper'

describe Feed do
  it "requires title" do
    Feed.new(title: nil).should_not be_valid
  end
  it "requires feed_url" do
    Feed.new(feed_url: nil).should_not be_valid
  end
end