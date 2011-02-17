require 'spec_helper'

describe SessionChooser do
  it "calls app when no delegates/options provided" do
    env = { 
      "PATH_INFO"=>"/subscribe"
    }
    
    app = double('app')
    app.should_receive(:call).with(env)
    options = {}
    
    m = SessionChooser.new(app, options)
    m.call(env)
  end
  
  it "invokes middleware delegate on matched path" do
    env = { 
      "PATH_INFO"=>"/subscribe"
    }
    
    options = {
      /subscribe/ => [FakeMiddleware, :foo]
    }
    
    m = SessionChooser.new(:app, options)
    m.call(env).should == :foo
  end
  
  it "invokes first matching delegate" do
    env = { 
      "PATH_INFO"=>"/subscribe"
    }
    
    options = {
      /oingoboingo/ => [FakeMiddleware, :baz],
      /subscribe/ => [FakeMiddleware, :foo]
    }
    
    m = SessionChooser.new(:app, options)
    m.call(env).should == :foo
  end
  
end

class FakeMiddleware
  
  def initialize(app, options)
    @response_to_give = options
  end
  
  def call(env)
    @response_to_give
  end
  
end