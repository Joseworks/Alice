class Stats
  def post_count
    Post.count
  end

  def comment_count
    Comment.count
  end

  def tag_count
    Post.tag_counts.count
  end
end
