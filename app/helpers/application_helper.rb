module ApplicationHelper
  # def author
  #   Struct.new(:name, :email).new(enki_config[:author][:name], enki_config[:author][:email])
  # end

  # RailsCast #228 on sortable table columns
  def sortable(column, title = nil)
    title ||= column.titleize
    # css_class = column == sort_column ? "current #{sort_direction}" : nil
    direction = column == sort_column && sort_direction == "asc" ? "desc" : "asc"
    link_to title, {:sort => column, :direction => direction}, {:class => "admin-link"}
  end
end
