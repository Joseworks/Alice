class User < ActiveRecord::Base
  validates_presence_of :name, :email, :uid

  def self.from_omniauth(auth)
    create_with_omniauth(auth)
  end

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth["provider"]
      user.uid = auth["uid"]
      user.name = auth["info"]["name"]
      user.email = auth["info"]["email"]
    end
  end

end
