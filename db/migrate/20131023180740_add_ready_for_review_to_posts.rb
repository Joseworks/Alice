class AddReadyForReviewToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :ready_for_review, :datetime
  end
end
