class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :current_user
  helper_method :tags_for_cloud
  helper_method :top_posts

  protected

  def enki_config
    @@enki_config = Enki::Config.default
  end
  helper_method :enki_config

  private

    def current_user
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

    def tags_for_cloud
      @tags = Post.tag_counts_on(:tags).order('count desc').limit(15)
    end

    def top_posts
      @top_posts = Post.where("published_at >= ?", (Time.zone.now.beginning_of_day - 3.days)).order('posts.impressions_count DESC').limit(3)
    end

end
