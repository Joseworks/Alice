class AddContextToTaggings < ActiveRecord::Migration
  def change
    add_column :taggings, :context, :string
  end
end
