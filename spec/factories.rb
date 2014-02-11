require 'factory_girl'

# These factories are used by some rspec specs, as opposed
# to the ones used by cucumber which are defined elsewhere.
FactoryGirl.define do
  factory :post do
    title                'My Post'
    author               'Quidnunc RE staff'
    body                 'hello this is my post'
    intro_text           'this is some intro text'
    tag_list             'red, green, blue'
    published_at_natural '1/1/2014'
    slug                 'my-manually-entered-slug'
    minor_edit           '0'
  end

  factory :user do
    sequence(:id) {|n|+5}
    sequence(:name) {|n| "name#{n}" }
    sequence(:email) {|n| "email#{n}@factory.com" }
    sequence(:password) {|n| "password_#{n}" }
    provider             "google_oauth2"
    sequence(:uid) {|n| "#{n}"}
  end

end
