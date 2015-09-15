# Phase 1: Displaying, Adding and Editing Records

## Rails
### Models
* Record
* Genre
* Style
* GenreTagging
* StyleTagging

### Controllers
* Api::RecordsController (create, destroy, index, show)
* Api::GenresController (index)
* Api::StylesController (index)

### Views
* records/index.json.jbuilder
* records/show.json.jbuilder
* records/\_record.json.jbuilder
* genres/index.json.jbuilder
* styles/index.json.jbuilder

## Backbone
### Models
* Record

### Collections
* Records

### Views
* RecordsIndex
* RecordsIndexItem
* RecordShow
* RecordForm

## Gems/Libraries
