class BundlerLove < ActiveRecord::Migration
  def self.up
    CrmContact.create(:email => "bundlerguy@14to9.org")
  end

  def self.down
  end
end
