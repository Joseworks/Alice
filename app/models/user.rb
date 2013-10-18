class User < ActiveRecord::Base
  validates_presence_of :name, :email, :uid

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
      # user.openid_url = 'http://example.com'
    end
  end

end
