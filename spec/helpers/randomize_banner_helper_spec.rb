require 'spec_helper'

describe RandomizeBannersHelper do
  include RandomizeBannersHelper

  describe '#randomize_side_banner' do
    it 'should not repeat the same banner' do
      banner1 = randomize_side_banner
      banner2 = randomize_side_banner
      banner1.should_not == banner2
    end
  end
end
