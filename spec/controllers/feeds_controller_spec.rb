require 'spec_helper'

describe FeedsController do
  include BilgePump::Specs

  def attributes_for_create
    { title: "create title"}
  end

  def attributes_for_update
    { title: "update title"}
  end

end