require 'factory_girl'

# These factories are used by some rspec specs, as opposed
# to the ones used by cucumber which are defined elsewhere.
FactoryGirl.define do
  factory :post do
    title                'My Post'
    author               'Quidnunc staff'
    body                 'hello this is my post'
    intro_text           'this is some intro text'
    tag_list             'red, green, blue'
    published_at_natural 'now'
    slug                 'my-manually-entered-slug'
    minor_edit           '0'
  end

  factory :user do
    name                 "Don Alias"
    email                "don@enkiblog.com"
    provider             "google_oauth2"
    uid                  "averylongnumber"
  end
end
