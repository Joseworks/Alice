class AddTaggerIdToTaggings < ActiveRecord::Migration
  def change
    add_column :taggings, :tagger_id, :integer
  end
end
