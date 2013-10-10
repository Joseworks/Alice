class User < ActiveRecord::Base
  validates_presence_of :name, :email
  validate :openid_valid

  class << self
    # Finds the user with open_id matching the given open_id address
    def with_openid_url(open_id)
      uri = URI.parse(open_id)
      find(:all).detect {|a| a.openid_url == uri}
    end
  end

  def openid_url
    @openid_url || URI.parse(read_attribute(:openid_url))
  end
  def openid_url=(uri)
    @openid_url = begin
      URI.parse(uri)
    rescue URI::InvalidURIError
      nil
    end
    write_attribute(:openid_url, uri.to_s)
  end

  private
    def openid_valid
      unless self.openid_url && (self.openid_url.is_a?(URI::HTTP) || self.openid_url.is_a?(URI::HTTPS))
        errors.add(:openid_url, "not a valid OpenID URL")
      end
    end
end
