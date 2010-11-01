BATCHBOOK_CONFIG = YAML.load_file("#{RAILS_ROOT}/config/batchbook.yml")[RAILS_ENV] unless defined? BATCHBOOK_CONFIG

BatchBook.account = BATCHBOOK_CONFIG['account']
BatchBook.token = BATCHBOOK_CONFIG['api_key']
