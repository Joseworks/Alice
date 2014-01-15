class StaticPageController < ApplicationController
  before_filter :top_posts
  before_filter :tags_for_cloud

  def signup_form
  end

end
