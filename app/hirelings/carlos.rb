#!/usr/bin/env ruby

# "Carlos" updates the crm system with new contacts

class Carlos < Hireling

  def work
    work_on_items_from(CrmContact.unpushed) do |contact|
      Rails.logger.debug "Pushing contact '#{contact.first_name} #{contact.last_name}' to CRM."
      CrmBridge.add_contact(contact)
      contact.update_attribute(:crm_pushed_at, Time.now)
    end
  end

end

