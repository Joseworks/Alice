require 'spec_helper'

describe SlugProcessor, '#slugorize' do
  it "should lowercase everything" do
    SlugProcessor.slugorize("ABCDEF").should == "abcdef"
  end

  it "should leave alphanumerics and hyphens alone" do
    SlugProcessor.slugorize("abc-123").should == "abc-123"
  end

  it "should ditch entities" do
    SlugProcessor.slugorize("abc&lt;-&#60;xyz").should == "abc-xyz"
  end

  it "should replace & with and" do
    SlugProcessor.slugorize("a-&-b-&-c").should == "a-and-b-and-c"
  end

  it "should strip all non-alphanumeric characters except - and &" do
    SlugProcessor.slugorize('abc""!@#$%^*()/=+|\[],.<>123').should == "abc-123"
  end

  it "should not allow apostrophes" do
    SlugProcessor.slugorize("tomato's").should == "tomatos"
  end

  it "should replace all whitespace with a dash" do
    SlugProcessor.slugorize("abc\n\t     xyz").should == "abc-xyz"
  end

  it "should trim dashes at the tail" do
    SlugProcessor.slugorize("abc--").should == "abc"
  end

  it "should trim dashes at the head" do
    SlugProcessor.slugorize("--abc").should == "abc"
  end

  it "should collapse multiple dashes" do
    SlugProcessor.slugorize("abc---xyz").should == "abc-xyz"
  end
  it "should collapse a single apostrophe" do
    SlugProcessor.slugorize("abc'xyz").should == "abcxyz"
  end
end

