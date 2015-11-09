# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w(
  default-user.png
  default-record.png
  default-artist.png
  default-label.png
  favicon.ico
  favicon-16x16.png
  favicon-32x32.png
  favicon-96x96.png
  search.svg
  application.css
  application.scss
  application.js
)
