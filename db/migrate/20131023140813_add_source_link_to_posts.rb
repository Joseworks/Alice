class AddSourceLinkToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :source_link, :string, default: ''
  end
end
