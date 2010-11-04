class CrmContact < ActiveRecord::Base

  scope :unpushed, :conditions => ["crm_pushed_at is null"]

end