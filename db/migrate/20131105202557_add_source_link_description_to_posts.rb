class AddSourceLinkDescriptionToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :source_link_description, :string
  end
end
