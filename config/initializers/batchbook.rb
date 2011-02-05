Quidnunc::BatchbookConfig = YAML.load_file("#{Rails.root.to_s}/config/batchbook.yml")[Rails.env] unless defined? Quidnunc::BatchbookConfig

BatchBook.account = Quidnunc::BatchbookConfig['account']
BatchBook.token = Quidnunc::BatchbookConfig['api_key']