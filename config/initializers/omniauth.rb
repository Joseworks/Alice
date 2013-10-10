Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, '859497051931.apps.googleusercontent.com', 'iU6-Lt_tm5GBYBdmAPtAilHo'
end