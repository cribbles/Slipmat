# Phase 4: Artists and Labels

## Rails
### Models

### Controllers
* Api::ArtistsController (create, destroy)
* Api::LabelsController (create, destroy)

### Views
* artists/show.json.jbuilder
* artists/index.json.jbuilder
* labels/show.json.jbuilder
* labels/index.json.jbuilder

## Backbone
### Models
* Artist (parses nested `record` association)
* Label (parses nested `record` association)

### Collections
* Artists
* Labels

### Views
* ArtistShow
* ArtistsIndex
* LabelShow
* LabelsIndex

## Gems/Libraries
