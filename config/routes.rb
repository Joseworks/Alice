Enki::Application.routes.draw do
  match "/signup" => "static_page#signup_form", via: :get

  match 'contact' => 'contact#new', :via => :get
  match 'contact' => 'contact#create', :via => :post


  namespace :admin do

    resource :session

    resources :posts, :pages do
      post 'preview', :on => :collection
    end
    resources :undo_items do
      post 'undo', :on => :member
    end
    resources :users

    get 'health(/:action)' => 'health', :action => 'index', :as => :health

    root :to => 'dashboard#show'
  end

  resources :archives, :only => [:index]
  resources :pages, :only => [:show]

  constraints :year => /\d{4}/, :month => /\d{2}/, :day => /\d{2}/ do
    get ':year/:month/:day/:slug' => 'posts#show'
  end

  scope :to => 'posts#index' do
    get 'posts.:format', :as => :formatted_posts
    get '(:tag)', :as => :posts
  end

  match "/auth/:provider/callback" => "admin/sessions#create", via: [:get, :post]


  root :to => 'posts#index'
end
