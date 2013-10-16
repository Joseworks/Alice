module DateHelper
  def format_month(date)
    date.strftime("%B %Y")
  end

  def format_post_date(date)
    date.strftime("%l:%M, %B %d, %Y")
  end

end
