class User < ActiveRecord::Base
  validates_presence_of :name, :email
  validate :open_id_valid

  class << self
    # Finds the user with open_id matching the given open_id address
    def with_open_id_url(open_id)
      uri = URI.parse(open_id)
      find(:all).detect {|a| a.open_id_url == uri}
    end
  end

  def open_id_url
    @open_id_url || URI.parse(read_attribute(:open_id_url))
  end
  def open_id_url=(uri)
    @open_id_url = begin
      URI.parse(uri)
    rescue URI::InvalidURIError
      nil
    end
    write_attribute(:open_id_url, uri.to_s)
  end

  private
    def open_id_valid
      unless self.open_id_url && (self.open_id_url.is_a?(URI::HTTP) || self.open_id_url.is_a?(URI::HTTPS))
        errors.add(:open_id_url, "not a valid OpenID URL")
      end
    end
end
