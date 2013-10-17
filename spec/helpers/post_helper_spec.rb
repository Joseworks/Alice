require File.dirname(__FILE__) + '/../spec_helper'

describe PostsHelper do
  include PostsHelper

  describe '#updated_time' do
    it 'shows nothing for non-updated post' do
      now = Time.now
      post = mock_model(Post,
        :updated?          => false
        )

      updated_time(post).should == nil
    end

    it 'shows the update-time' do
      before = Time.now - 1
      now = Time.now
      post = mock_model(Post,
        :created_at        => before,
        :updated_at        => now,
        :updated?          => true
        )

      updated_time(post).should == "Updated:#{now.strftime("%l:%M, %b %d")}"
    end
  end
end
