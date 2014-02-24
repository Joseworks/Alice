class SitemapController < ApplicationController
  layout nil

  def index
    headers['Content-Type'] = 'application/xml'
    last_post = Post.last
    if stale?(:etag => last_post, :last_modified => last_post.updated_at.utc)
      respond_to do |format|
        format.xml { @posts = Post.find(
        :all,
        order:      'posts.published_at DESC',
        conditions: ['published_at < ?', Time.now]
      ) }
      end
    end
  end
end
