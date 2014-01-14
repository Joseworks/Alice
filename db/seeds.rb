# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

15.times do |i|
  Post.create(title: "Post Number #{i}",
              body: "This is the post number #{i}.",
              intro_text: 'just another post.',
              published_at_natural: "January #{i}, 2014",
              tag_list: "Tag Number #{i}, This is one tag")
end
