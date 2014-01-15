class ArchivesController < ApplicationController
  before_filter :top_posts
  before_filter :tags_for_cloud

  def index
    @months = Post.find_all_grouped_by_month
  end
end
