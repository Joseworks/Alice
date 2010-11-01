Qre::Application.routes.draw do
  # See how all your routes lay out with "rake routes"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  match '/subscribe' => 'subscriptions#new'

  resources :subscriptions, :only => [:create]

end
