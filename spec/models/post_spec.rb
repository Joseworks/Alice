require File.dirname(__FILE__) + '/../spec_helper'


describe Post, "integration" do
  describe 'setting tag_list' do
    it 'increments tag counter cache' do
      post1 = Post.create!(:author => "writer", :title => 'My Post', :body => "body", :intro_text => 'intro', :tag_list => "ruby")
      post2 = Post.create!(:author => "staff", :title => 'My Post', :body => "body", :intro_text => 'intro', :tag_list => "ruby")
      Post.tagged_with('ruby').count.should == 2
      Post.last.destroy
      Post.tagged_with('ruby').count.should == 1
    end
  end
end

describe Post, ".find_recent" do
  it 'finds the most recent posts that were published before now' do
    now = Time.now
    Time.stub(:now).and_return(now)
    Post.should_receive(:paginate).with({
      :order      => 'posts.published_at DESC',
      :conditions => ['published_at < ?', now],
      :page       => nil
    })
    Post.find_recent
  end

  it 'finds the most recent posts that were published before now, with a page number' do
    now = Time.now
    Time.stub(:now).and_return(now)
    Post.should_receive(:paginate).with({
      :order      => 'posts.published_at DESC',
      :conditions => ['published_at < ?', now],
      :page       => 1
    })
    Post.find_recent(page: 1)
  end

  it 'finds the most recent posts that were published before now with a tag' do
    now = Time.now
    Time.stub(:now).and_return(now)
    Post.stub_chain(:tagged_with, :paginate)
    Post.should_receive(:tagged_with).with('test')
    Post.find_recent(:tag => 'test')
  end

  it 'finds the most recent posts that were published before now with a tag, with page number' do
    now = Time.now
    Time.stub(:now).and_return(now)
    Post.stub_chain(:tagged_with, :paginate)
    Post.should_receive(:tagged_with).with('code')
    Post.find_recent(:tag => 'code', page: 1)
  end

  it 'finds all posts grouped by month' do
    now = Time.now
    Time.stub(:now).and_return(now)
    posts = [1, 1, 2].collect {|month| mock_model(Post, :month => month) }
    Post.should_receive(:find).with(:all, {
      :order      => 'posts.published_at DESC',
      :conditions => ['published_at < ?', now]
    }).and_return(posts)
    months = Post.find_all_grouped_by_month.collect {|month| [month.date, month.posts]}
    months.should == [[1, [posts[0], posts[1]]], [2, [posts[2]]]]
  end
end

describe Post, '#generate_slug' do
  it 'makes a slug from the title if slug if blank' do
    post = Post.new(:slug => '', :title => 'my title')
    post.generate_slug
    post.slug.should == 'my-title'
  end

  it 'replaces & with and' do
    post = Post.new(:slug => 'a & b & c')
    post.generate_slug
    post.slug.should == 'a-and-b-and-c'
  end

  it 'replaces non alphanumeric characters with -' do
    post = Post.new(:slug => 'a@#^*(){}b')
    post.generate_slug
    post.slug.should == 'a-b'
  end

  it 'does not modify title' do
    post = Post.new(:title => 'My Post')
    post.generate_slug
    post.title.should == 'My Post'
  end
end

describe Post, '#tag_list=' do
  it 'accept an array argument so it is symmetrical with the reader' do
    p = Post.new
    p.tag_list = ["a", "b"]
    p.tag_list.should == ["a", "b"]
  end
end

describe Post, "#set_dates" do
  describe 'when minor_edit is false' do
    it 'sets edited_at to current time' do
      now = Time.now
      Time.stub(:now).and_return(now)
      post = Post.new(:edited_at => 1.day.ago)
      post.stub(:minor_edit?).and_return(false)

      post.set_dates
      post.edited_at.should == now
    end
  end

  describe 'when edited_at is nil' do
    it 'sets edited_at to current time' do
      now = Time.now
      Time.stub(:now).and_return(now)

      post = Post.new
      post.stub(:minor_edit?).and_return(true)
      post.set_dates
      post.edited_at.should == now
    end
  end

  describe 'when minor_edit is true' do
    it 'does not changed edited_at' do
      post = Post.new(:edited_at => now = 1.day.ago)
      post.stub(:minor_edit?).and_return(true)
      post.set_dates
      post.edited_at.should == now
    end
  end

  it 'sets published_at by parsing published_at_natural with chronic' do
    now = Time.now
    post = Post.new(:published_at_natural => 'now')

    Chronic.should_receive(:parse).with('now').and_return(now)
    post.set_dates
    post.published_at.should == now
  end

  it 'does not set published_at if published_at_natural is invalid' do
    pub = 1.day.ago
    post = Post.new(:published_at_natural => 'bogus', :published_at => pub)
    Chronic.should_receive(:parse).with('bogus').and_return(nil)

    post.set_dates
    post.published_at.should == pub
  end

  # for reasons still under investigation, the 'set_dates' part of this sprays
  # deprecation/obsolescence warnings for Time.succ
  it 'preserves published_at if published_at_natural is nil' do

    pub = 1.day.ago
    post = Post.new(:published_at_natural => nil, :published_at => pub)
    # magic^h^h^h^h^h problem happens here.
    # Problem might be solved by update to Chronic gem.
    # Enabling this method call pending further verification.
    post.set_dates
    # Some rounding/truncating is acceptable...
    post.published_at.should be_within(60.seconds).of(pub)
  end

  it 'clears published_at if published_at_natural is empty' do
    pub = 1.day.ago
    post = Post.new(:published_at_natural => '', :published_at => pub)
    post.set_dates
    post.published_at.should == nil
  end
end

describe Post, "#minor_edit" do
  it('returns "1" by default') { Post.new.minor_edit.should == "1" }
end

describe Post, '#published?' do
  before(:each) do
    @post = Post.new
  end

  it "should return false if published_at is not filled" do
    @post.should_not be_published
  end

  it "should return true if published_at is filled" do
    @post.published_at = Time.now
    @post.should be_published
  end
end

describe Post, '#updated?' do
  it 'returns true if edited_at does not match published_at' do
    before = 1.day.ago
    updated = 1.hour.ago
    now = Time.now
    Time.stub(:now).and_return(now)
    post = Post.new(created_at: before, published_at: updated, edited_at: now)
    # post.updated_at = now
    post.stub(:minor_edit?).and_return(false)

    post.set_dates
    post.updated?.should == true
  end

  it 'returns false if edited_at the same as published_at' do
    before = 1.day.ago
    now = Time.now
    Time.stub(:now).and_return(now)
    post = Post.new(created_at: before, published_at: now, edited_at: now)
    post.stub(:minor_edit?).and_return(false)

    post.updated?.should == false
  end

  it 'returns false if minor_edit is true' do
    before = 1.day.ago
    now = Time.now
    Time.stub(:now).and_return(now)
    post = Post.new(created_at: before, published_at: before, edited_at: before, minor_edit: '1')

    post.updated?.should == false
  end

end

describe Post, "#minor_edit?" do
  it('returns true when minor_edit is 1')  { Post.new(:minor_edit => "1").minor_edit?.should == true }
  it('returns false when minor_edit is 0') { Post.new(:minor_edit => "0").minor_edit?.should == false }
  it('returns true by default')            { Post.new.minor_edit?.should == true }
end

describe Post, 'before validation' do
  it 'calls #generate_slug' do
    post = Post.new(:title => "My Post", :body => "body")
    post.valid?
    post.slug.should_not be_blank
  end

  it 'calls #set_dates' do
    post = Post.new(:title => "My Post",
                    :body => "body",
                    :published_at_natural => 'now')
    post.valid?
    post.edited_at.should_not be_blank
    post.published_at.should_not be_blank
  end
end

describe Post, 'validations' do
  def valid_post_attributes
    {
      :author               => "Quidnunc Staff",
      :title                => "My Post",
      :slug                 => "my-post",
      :intro_text           => "this is an introduction",
      :body                 => "hello this is my post",
      :intro_text           => "this is my intro text",
      :published_at_natural => 'now'
    }
  end

  it 'is valid with valid_post_attributes' do
    Post.new(valid_post_attributes).should be_valid
  end

  it 'is invalid with no author' do
    Post.new(valid_post_attributes.merge(author: '')).should_not be_valid
  end

  it 'is invalid with no title' do
    Post.new(valid_post_attributes.merge(:title => '')).should_not be_valid
  end

  it 'is invalid with no intro text' do
    Post.new(valid_post_attributes.merge(:intro_text => '')).should_not be_valid
  end

  it 'is invalid with no body' do
    Post.new(valid_post_attributes.merge(:body => '')).should_not be_valid
  end

  it 'is invalid with bogus published_at_natural' do
    Post.new(valid_post_attributes.merge(:published_at_natural => 'bogus')).should_not be_valid
  end
end

describe Post, '.flag_for_review' do
  before(:each) do
    @post = Post.new(:author => "Agent Coulson",
                                   :title => 'My Post',
                                   :intro_text => 'intro text',
                                   :body => "body",
                                   :tag_list => "ruby")
  end

  it 'sets the ready_for_review' do
    now = Time.now
    Time.stub(:now).and_return(now)

    @post.flag_for_review
    @post.ready_for_review.should == now
  end
end

describe Post, '.publish_now' do
  before(:each) do
    @post = Post.new(:author => "Agent Coulson",
                                   :title => 'My Post',
                                   :intro_text => 'intro text',
                                   :body => "body",
                                   :tag_list => "ruby")
  end

  it 'sets the ready_for_review' do
    now = Time.now
    Time.stub(:now).and_return(now)

    @post.publish_now
    @post.published_at.should == now
  end

end

describe Post, '.previous and .next' do
  before(:each) do
    @previous_post = Post.create(:author => "Agent Coulson",
                                   :title => 'My Post',
                                   :intro_text => 'intro text',
                                   :body => "body",
                                   :tag_list => "ruby", published_at: (Time.now - 1))

    @post = Post.create(:author => "Agent Coulson",
                                   :title => 'My Post',
                                   :intro_text => 'intro text',
                                   :body => "body",
                                   :tag_list => "ruby", published_at: Time.now)
  end

  it 'finds the previous published post' do
    @post.previous.should == @previous_post
  end

  it 'finds the next published post' do
    @previous_post.next.should == @post
  end


end