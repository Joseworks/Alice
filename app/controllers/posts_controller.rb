class PostsController < ApplicationController
  def index
    @tag = params[:tag]
    @tags = Post.tag_counts_on(:tags).order('count desc').limit(15)
    @posts = Post.find_recent(tag: @tag, include: :tags, page: params[:page])

    respond_to do |format|
      format.html
      format.atom { render layout: false }
    end
  end

  def show
    @post = Post.find_by_permalink(*([:year, :month, :day, :slug].collect {|x| params[x] } << {include: [:tags]}))
  end

  def tag_cloud
    @tags = Post.tag_counts_on(:tags)
  end
end
