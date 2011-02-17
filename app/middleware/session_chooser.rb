class SessionChooser
    
  def initialize(app, options)
    @app = app
    # instantiate our various delegates and key them by path regex
    # from the options
    @delegates = options.map do |k, (middleware_class, *args)| 
      [k, middleware_class.new(@app, *args)]
    end
  end
  
  def call(env)
    rack_request = Rack::Request.new(env)

    # check the request path for a match against our options
    @delegates.each do |path, delegate|
      # pass the call to the right instance and be done
      return delegate.call(env) if rack_request.path =~ path
    end
    @app.call(env)
  end
  
end