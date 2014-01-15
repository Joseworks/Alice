class PagesController < ApplicationController
  before_filter :top_posts
  before_filter :tags_for_cloud

  def show
    @page = Page.find_by_slug(params[:id]) || raise(ActiveRecord::RecordNotFound)
  end
end
