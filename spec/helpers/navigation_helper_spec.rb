require File.dirname(__FILE__) + '/../spec_helper'

describe NavigationHelper do
  include NavigationHelper
    describe '#page_links_for_navigation' do
    it 'returns an array with Home and Archive linkholders' do
      links = page_links_for_navigation
      expect(links.length).to eq(2)
      expect(links[0].name).to eq('Home')
      expect(links[1].name).to eq('Archives')
    end

    it 'returns an array with Home and Archive linkholders and a page' do
      page = Page.create( :title => 'my page', :body => 'The Body' )
      links = page_links_for_navigation
      expect(links.length).to eq(3)
      expect(links[2].name).to eq('my page')
    end
  end
end

