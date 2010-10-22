# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_qre_session',
  :secret      => '4599d878e32205cf126031a46dbf2ae67226fe2e975cdb72fbbbf6b9a47a6295259d7e47429ef1382a29b891db7066244fceb0b29b75b17f6340a737d30f5664'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
