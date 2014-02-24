Enki::Application.routes.draw do
  devise_for :users, :path =>'',  :controllers => { :omniauth_callbacks => "omniauth_callbacks" }
  match "/signup" => "static_page#signup_form", via: :get

  match 'contact' => 'contact#new', :via => :get
  match 'contact' => 'contact#create', :via => :post

  match 'tipline' => 'tipline#new', :via => :get
  match 'tipline' => 'tipline#create', :via => :post

  match 'join_us' => 'join_us#new', :via => :get
  match 'join_us' => 'join_us#create', :via => :post

  get 'sitemap.xml', :to => 'sitemap#index', :defaults => { :format => 'xml' }

  namespace :admin do

    resource :session

    resources :posts do
      post 'preview', :on => :collection
      member do
        post :publish_post
      end
    end

    resources :pages do
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

  root :to => 'posts#index'
end
