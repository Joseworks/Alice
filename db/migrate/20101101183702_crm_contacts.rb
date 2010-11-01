class CrmContacts < ActiveRecord::Migration
  def self.up
    create_table :crm_contacts do |t|
      t.string   :email, :null => false
      t.string   :first_name
      t.string   :last_name
      t.datetime :crm_pushed_at
      t.timestamps
    end
  end

  def self.down
    drop_table :crm_contacts
  end
end
