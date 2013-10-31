class Admin::DashboardController < Admin::BaseController
  def show
    @posts            = Post.where(published_at:nil)
    # Post.find_recent(:limit => 8)
    @stats            = Stats.new
  end
end
