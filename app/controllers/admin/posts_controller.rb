class Admin::PostsController < Admin::BaseController
  before_filter :find_post, only: [:show, :update, :destroy]
  helper_method :sort_column, :sort_direction

  def index
    respond_to do |format|
      format.html {
        @posts = Post.paginate(
          order: ("#{sort_column} #{sort_direction}"),
          page: params[:page]
        )
      }
    end
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      respond_to do |format|
        format.html {
          flash[:notice] = "Created post '#{@post.title}'"
          redirect_to(action: 'show', id: @post)
        }
      end
    else
      respond_to do |format|
        format.html { render action: 'new', status: :unprocessable_entity }
      end
    end
  end

  def update
    if @post.update_attributes(post_params)
      respond_to do |format|
        format.html {
          flash[:notice] = "Updated post '#{@post.title}'"
          redirect_to(action: 'show', id: @post)
        }
      end
    else
      respond_to do |format|
        format.html { render action: 'show', status: :unprocessable_entity }
      end
    end
  end

  def show
    respond_to do |format|
      format.html {
        render partial: 'post', locals: {post: @post} if request.xhr?
      }
    end
  end

  def new
    @post = Post.new(author: current_user.name)
  end

  def preview
    @post = Post.build_for_preview(params[:post])

    respond_to do |format|
      format.js {
        render partial: 'posts/post', locals: {post: @post}
      }
    end
  end

  def destroy
    undo_item = @post.destroy_with_undo

    respond_to do |format|
      format.html do
        flash[:notice] = "Deleted post '#{@post.title}'"
        redirect_to action: 'index'
      end
      format.json {
        render json: {
          undo_path:    undo_admin_undo_item_path(undo_item),
          undo_message: undo_item.description,
          post:         @post.attributes
        }
      }
    end
  end

  private

    # derived from RailsCast #228 sortable table columns
    def sort_column
      Post.column_names.include?(params[:sort]) ? params[:sort] : "coalesce(published_at, updated_at)"
    end

    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : "DESC"
    end

    def post_params
      params.require(:post).permit(:author, :title, :body, :intro_text, :tag_list,
                                   :image, :published_at_natural, :slug, :minor_edit,
                                   :source_link, :source_link_description,
                                   :ready_for_review)
    end

  protected

    def find_post
      @post = Post.find(params[:id])
    end

end
