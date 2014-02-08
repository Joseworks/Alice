require 'spec_helper'

describe RandomizeBannersHelper do
  include RandomizeBannersHelper

  describe '#randomize_side_banner' do
    it 'should not repeat the same banner' do
      ['Q-WebAd-2-250.png', 'Q-WebAd-250.png', 'Q-WebAd-4-250.png', 'Q-WebAd-5-250.png'].
      should include randomize_side_banner
    end
  end
end
