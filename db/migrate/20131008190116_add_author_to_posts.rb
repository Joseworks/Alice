class AddAuthorToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :author, :string, default: "Quidnunc Staff"
  end
end
