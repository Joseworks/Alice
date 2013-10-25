require 'factory_girl'

FactoryGirl.define do
  factory :tag do
    name 'Tag'
  end

  factory :post do
    title     'A post'
    author    'Writer Person'
    slug      'a-post'
    body      'This is a post'
    intro_text 'This is intro text'

    published_at { 1.day.ago }
    created_at   { 1.day.ago }
    updated_at   { 1.day.ago }
  end

end