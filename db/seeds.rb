# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)


(1..12).each  do |k|
  (1..26).each do |i|
    Post.create!(title: "Post Number #{i}",
                body: "This is the post number #{i}.",
                intro_text: 'just another post.',
                published_at_natural: "#{Date::MONTHNAMES[k]}, #{i}, 2014",
                tag_list: "Tag Number #{i}, This is one tag",
                slug:"#{i}-#{k}-#{rand()}")
  end
end
