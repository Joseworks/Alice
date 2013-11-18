module NavigationHelper
  def page_links_for_navigation
    [LinkHolder.new("Home", root_path),
     LinkHolder.new("Archives", archives_path)] +
      Page.order('title').collect { |page| LinkHolder.new(page.title, page_path(page.slug)) }
  end

  def category_links_for_navigation
    @popular_tags ||= Post.all_tags.reject { |tag| tag.taggings.empty? }.sort_by { |tag| tag.taggings.size }.reverse
    @popular_tags.collect { |tag| LinkHolder.new(tag.name, posts_path(:tag => tag.name)) }
  end

  def class_for_tab(tab_name, index)
    classes = []
    classes << 'current' if "admin/#{tab_name.downcase}" == params[:controller]
    classes << 'first'   if index == 0
    classes.join(' ')
  end
end
