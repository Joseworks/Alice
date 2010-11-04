Qre::BatchbookConfig = YAML.load_file("#{Rails.root.to_s}/config/batchbook.yml")[Rails.env] unless defined? Qre::BatchbookConfig

BatchBook.account = Qre::BatchbookConfig['account']
BatchBook.token = Qre::BatchbookConfig['api_key']