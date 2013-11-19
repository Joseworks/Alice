class Admin::UsersController < Admin::BaseController
  before_filter :find_user, only: :update


  def index
    @users = User.all
  end

  def update
    if @user.update_attributes(user_params)
      respond_to do |format|
        format.html {
          flash[:notice] = "Updated user '#{@user.name}'"
          redirect_to(action: 'index')
        }
      end
    else
      respond_to do |format|
        format.html { render action: 'index', status: :unprocessable_entity }
      end
    end
  end

  private
      def user_params
      params.require(:user).permit(:name, :email, :role)
    end

    def find_user
      @user = User.find(params[:id])
    end


end
