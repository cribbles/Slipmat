Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, only: [:new, :create]

  namespace :api, defaults: { format: :json } do
    resources :records, only: [:create, :update, :destroy, :show, :index]
  end
end
