class LinkHolder
  def initialize(name, url)
    @name = name
    @url = url
  end

  attr_reader :name, :url
end
