Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, only: [:new, :create]

  namespace :api, defaults: { format: :json } do
    get 'search', to: 'search#search' 
    resources :countries, only: :index
    resources :genres, only: :index
    resources :users,   only: [:create, :update, :destroy, :show]
    resource  :session, only: [:create, :destroy, :show]
    resources :artists, only: [:create, :update, :destroy, :show, :index]
    resources :labels,  only: [:create, :update, :destroy, :show, :index]
    resources :records, only: [:create, :update, :destroy, :show, :index]
    resources :user_collections, only: [:create, :destroy, :show]
    resources :user_wants, only: [:create, :destroy, :show]
    resources :comments, only: [:create, :destroy]
  end

  get "/auth/:provider/callback", to: "api/sessions#omniauth"
end
