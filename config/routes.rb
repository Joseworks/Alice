ActionController::Routing::Routes.draw do |map|
  # The priority is based upon order of creation: first created -> highest priority.
  map.subscribe 'subscribe', :controller => 'subscriptions', :action => 'new'

  map.resource :subscription, :only => [:create]

  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
