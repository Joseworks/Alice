class MonthPostHolder
  def initialize(date, posts)
    @date = date
    @posts = posts
  end

  attr_reader :date, :posts
end
