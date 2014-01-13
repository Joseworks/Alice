source 'https://rubygems.org'

ruby "2.0.0"

gem 'rails', '~> 4.0.0'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

# Gems used only for assets and not required
# in production environments by default.
gem 'sass-rails'
gem 'jquery-rails'

# Use unicorn as the web server
gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug'

# Bundle the extra gems:
gem 'redcarpet', :require => 'redcarpet'
gem 'chronic'
gem 'coderay', '~> 1.0.5'
gem 'formtastic'
gem 'will_paginate', '~> 3.0.2'
gem 'exception_notification'
gem "omniauth-google-oauth2"
gem "paperclip", "~> 3.0"
gem 'aws-sdk'
gem 'acts-as-taggable-on'
gem 'tinymce-rails'
gem 'impressionist'
gem 'pg'


# Bundle gems for the local environment. Make sure to
# put test-only gems in this group so their generators
# and rake tasks are available in development mode:
group :test do
  gem 'database_cleaner'
  gem 'factory_girl_rails'
  gem 'rspec'
  gem 'nokogiri', '~> 1.5.0'
  gem 'webrat'
end

group :development do
  gem 'rails-erd'
end

group :development, :test do
  gem 'rspec-rails'
end

group :production do
  gem 'rails_12factor'
end
