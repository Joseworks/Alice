# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def radiant_page(path)
    RADIANT_HOST_URL + path
  end

end
