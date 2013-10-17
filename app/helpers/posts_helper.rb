module PostsHelper
  # This isn't strictly correct, but it's a pretty good guess
  # and saves another hit to the DB
  def more_content?
    @posts.size == Post::DEFAULT_LIMIT
  end

  def updated_time(post)
    if post.updated?
      "Updated:#{post.updated_at.strftime("%l:%M, %b %d")}"
    end
  end
end
