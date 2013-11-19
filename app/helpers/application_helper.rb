module ApplicationHelper

  # RailsCast #228 on sortable table columns
  def sortable(column, title = nil)
    title ||= column.titleize
    direction = column == sort_column && sort_direction == "asc" ? "desc" : "asc"
    link_to title, {sort: column, direction: direction}, {class: "admin-link"}
  end
end
