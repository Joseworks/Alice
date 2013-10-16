module TagHelper
  def linked_tag_list(tags)
    raw tags.collect {|tag| link_to(tag, posts_path(tag))}.join(", ")
  end
end
