class User < ActiveRecord::Base
  validates_presence_of :name, :email, :uid
  # validate :openid_valid

  class << self
    # Finds the user with open_id matching the given open_id address
    def with_openid_url(open_id)
      uri = URI.parse(open_id)
      find(:all).detect {|a| a.openid_url == uri}
    end
  end

  def self.from_omniauth(auth)
    # find_by_provider_and_uid(auth["provider"], auth["uid"]) ||
    create_with_omniauth(auth)
  end

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth["provider"]
      user.uid = auth["uid"]
      user.name = auth["info"]["name"]
      user.email = auth["info"]["email"]
      user.openid_url = 'http://example.com'
    end
  end

end
