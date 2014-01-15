class PostsController < ApplicationController
  before_filter :tag_cloud
  before_filter :top_posts

  def index
    @tag = params[:tag]
    @posts = Post.find_recent(tag: @tag, include: :tags, page: params[:page])

    respond_to do |format|
      format.html
      format.atom { render layout: false }
    end
  end

  def show
    @post = Post.find_by_permalink(*([:year, :month, :day, :slug].collect {|x| params[x] } << {include: [:tags]}))

    impressionist @post
  end

  private
    def tag_cloud
      @tags = Post.tag_counts_on(:tags).order('count desc').limit(15)
    end

    def top_posts
      @top_posts = Post.where("published_at >= ?", (Time.zone.now.beginning_of_day - 3.days)).order('posts.impressions_count DESC').limit(3)
    end
end
