require File.dirname(__FILE__) + '/../spec_helper'

describe DeletePostUndo do
  describe '#process!' do
    it 'creates a new post with comments based on the attributes stored in #data' do
      post = Post.create!(:title => 'a', :body => 'b', :intro_text => 'intro')
      item = post.destroy_with_undo
      new_post = item.process!
    end
  end
end
