class PostsController < ApplicationController

  def index
    @tag = params[:tag]
    @tags = Post.tag_counts_on(:tags).order('count desc').limit(15)
    @posts = Post.find_recent(tag: @tag, include: :tags, page: params[:page])
    @top_posts = Post.where("created_at >= ?", (Time.zone.now.beginning_of_day - 1)).order('posts.impressions_count DESC').limit(3)

    respond_to do |format|
      format.html
      format.atom { render layout: false }
    end
  end

  def show
    @post = Post.find_by_permalink(*([:year, :month, :day, :slug].collect {|x| params[x] } << {include: [:tags]}))
    @tags = Post.tag_counts_on(:tags).order('count desc').limit(15)
    @top_posts = Post.where("created_at >= ?", (Time.zone.now.beginning_of_day - 1)).order('posts.impressions_count DESC').limit(3)


    impressionist @post
  end

  def tag_cloud
    @tags = Post.tag_counts_on(:tags)
  end
end
