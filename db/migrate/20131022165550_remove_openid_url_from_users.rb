class RemoveOpenidUrlFromUsers < ActiveRecord::Migration
  def up
    remove_column :users, :openid_url
  end

  def down
    add_column :users, :openid_url
  end
end
