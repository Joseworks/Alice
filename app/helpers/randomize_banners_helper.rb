module RandomizeBannersHelper
  def randomize_side_banner
    all_banners = ['Q-WebAd-2-250.png', 'Q-WebAd-250.png', 'Q-WebAd-4-250.png', 'Q-WebAd-5-250.png']
    random_banner = all_banners.sample
  end
end