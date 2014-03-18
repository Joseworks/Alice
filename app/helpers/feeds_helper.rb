module FeedsHelper
  require 'htmlentities'
  def title_decoder(title)
    coder = HTMLEntities.new
    coder.decode(title)
  end
end
