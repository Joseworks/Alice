# Be sure to restart your server when you modify this file.

# Quidnunc::Application.config.session_store :cookie_store, :key => '_qre_session'
Quidnunc::Application.config.session_store SessionChooser, {
  /^\/(admin|refinery|registrations)/ => [ActionDispatch::Session::CookieStore, :key => '_refinery_session'],
  // => [ActionDispatch::Session::CookieStore, :key => '_quidnunc_session']
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# Quidnunc::Application.config.session_store :active_record_store
