class Admin::DashboardController < Admin::BaseController
  def show
    @posts            = Post.where(published_at:nil)
    @stats            = Stats.new
  end
end
