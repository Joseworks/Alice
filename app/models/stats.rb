class Stats
  def post_count
    Post.count
  end

  def tag_count
    Post.tag_counts.count
  end
end
