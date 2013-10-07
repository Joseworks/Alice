# Be sure to restart your server when you modify this file.

if Rails.env.development? || Rails.env.test?
  Enki::Application.config.secret_key_base = SecureRandom.hex(20)
else
  # Your secret key for verifying the integrity of signed cookies.
  # If you change this key, all old signed cookies will become invalid!
  # Make sure the secret is at least 30 characters and all random,
  # no regular words or you'll be exposed to dictionary attacks.
  # raise "Generate a secret with `rake secret` and paste it into `config/initializers/secret_token.rb`."

  # If this is an open source project, DO NOT commit your secret to source
  # control. Load it from ENV or a file that is git ignored (File.read)
  Enki::Application.config.secret_token    = '4da10d9fa6d75b7f2e3e5691bc56185fc006c7145df994bea40725859b630d690980cff581764b8576ef3e223327aced6858b0d571008e82b76bb5520efcbf78' # To be removed in the next version of Enki
  Enki::Application.config.secret_key_base = '4da10d9fa6d75b7f2e3e5691bc56185fc006c7145df994bea40725859b630d690980cff581764b8576ef3e223327aced6858b0d571008e82b76bb5520efcbf78'
end
