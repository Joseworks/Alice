class CrmBridge

  def self.add_contact(crm_contact)
    BatchBook.account = Quidnunc::BatchbookConfig['account']
    BatchBook.token = Quidnunc::BatchbookConfig['api_key']

    person = BatchBook::Person.find(:first, :params => {:email => crm_contact.email})

    if (person.nil?)
      person = BatchBook::Person.new(:first_name => crm_contact.first_name, :last_name => crm_contact.last_name, :notes => "Created via batchbook API")
      person.save
      person.add_location(:label => "work", :email => crm_contact.email)
      person.save
    end

  end

end