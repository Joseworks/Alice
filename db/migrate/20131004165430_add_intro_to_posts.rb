class AddIntroToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :intro_text, :text
    add_column :posts, :intro_text_html, :text
  end
end
