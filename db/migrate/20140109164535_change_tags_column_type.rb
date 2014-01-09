class ChangeTagsColumnType < ActiveRecord::Migration
  def up
    change_column :posts, :cached_tag_list, :text
  end

  def down
    change_column :posts, :cached_tag_list, :string
  end
end
