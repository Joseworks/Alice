module NavigationHelper
  def page_links_for_navigation
    [LinkHolder.new("Home", root_path),
     LinkHolder.new("Archives", archives_path)] +
      Page.order('title').collect { |page| LinkHolder.new(page.title, page_path(page.slug)) }
  end
end
