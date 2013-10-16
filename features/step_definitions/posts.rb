Given /there is at least one post tagged "([\w\s]+)"/ do |tag_name|
  FactoryGirl.create(:post, :tag_list => 'awesome')
end

Given /there is at least one post titled "([\w\s]+)"/ do |title|
  FactoryGirl.create(:post, :title => title)
end

Given /a post with comments exists/ do
  FactoryGirl.create(:post, :comments => [FactoryGirl.create(:comment), FactoryGirl.create(:comment)])
end
