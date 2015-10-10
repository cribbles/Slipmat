# Slipmat

[Live](http://slipmat.xyz)

## Summary

Slipmat is a near-faithful clone of [Discogs](http://discogs.com), the
Internet's largest database and marketplace for audio recordings. Slipmat
replicates most of the core functionality and UI components of Discogs's
inventory and user systems. The main difference is that Slipmat is designed
from the ground up as a single-page application.

### Languages:
- Javascript
- Ruby
- HTML / CSS

### Frameworks:
- Backbone
- Rails

### Libraries and Technologies:
- jQuery / AJAX
- jQuery-UI
- paperclip / AWS
- pg_search
- kaminari
- figaro
- jbuilder
- omniauth
- friendly_id

## What can I do on this website?

You can:
- Securely create an account
- Log in using Facebook or Google
- Edit your own profile
- Add records to your wantlist and collection
- Contribute new records to the database
- Contribute information about records, artists, and labels
- Update, sort, and customize tracklists (using jQuery sortable UI)
- Tag and sort records by genre
- Comment on records, artists, and labels

Slipmat provides an robust interface for browsing, searching, and sorting
records, artists, and labels. It features:
- Live search results in the header search bar
- Global search indices for records, artists, and labels
- Stackable category filtering for records
  - Sort by year, genre, or country
- Tabbed and paginated index for records, artists, and labels

## API

Slipmat is powered by a RESTful JSON API.

I took great care to ensure correspondence between Backbone routes and API
endpoints. If you're on a page that displays data, you can replace the `#` in
the URI fragment at any time with `api` to see what's being served up for a
given view. This includes [search](http://slipmat.xyz/api/search?query=jackson)
and [sort](http://slipmat.xyz/api/records/search?genre=Electronic) results.

Many API responses handle nested data and associations. I made extensive use of
jbuilder to manage these. Nearly all Backbone models override the `parse` method
to keep track of nested associations.

I used Rails's counter caching and eager loading to optimize data retreival. API
responses are structured to prevent N+1 queries. I used model scoping with
`find_by_sql` as needed to minimize database fetching and keep controllers slim.

I structured user comments and contributions as polymorphic associations in
order to prevent bloat. This greatly reduced the overhead for my Rails models
and Backbone views.

## Slipmat.Import

Slipmat features a super handy [import
utility](app/assets/javascripts/utils/import.js), `Slipmat.Import`, for
constructing seed data based on real Discogs releases.

For my own convenience, I've bound it to a Backbone route. Visit
`#/import/(discogs release id)` if you want to try it out!

Here's how it works:

- `Import#import` takes Discogs release ID provided in the URI fragment as an
argument and fetches the release data from the [official Discogs
API](http://www.discogs.com/developers/) by making a GET request to the
release's API endpoint.
- On success, the payload is passed along to `Import#parse`. This parses the
Discogs data into Backbone model attributes, sets them on a new instance of
`Slipmat.Models.Record` and saves the record. This includes nested associations,
e.g. tracklist, genre taggings, artist and label.
- On success, the persisted model is passed along to `Import#fetchImage`, which
makes a separate GET request to the Discogs search engine, sending along the
artist name and album title as parameters.
- On success, the payload is scanned for the first associated thumbnail URI,
which is passed along to `Import#patchImage`. This updates the persisted model
by assigning the thumbnail to the its `image_url` attribute and saving it.

_N.B._ - under the hood, the Rails `Record` model doesn't really have an
`image_url` attribute. Instead, we override `#image_url=` like so:

```ruby
def image_url=(image_url)
  self.image = open(image_url)
end
```

This intercepts the thumbnail before saving the model and delegates the file
contents to Paperclip, which politely stores the thumbnail on AWS for us and
displays it normally (i.e. without image leeching).

## Future polishing touches (TBD)
- User activity / feed
- Git diff / wiki like updates for records, artists, and labels
- Comment on comments
- Multiple formats and releases (CD, Cassette, Reissue, Deluxe, etc.)
- Buy and sell records
- User messaging
- Ratings for records (5 star scale)
- Add records to lists (Best Reggae records of the 90s, etc.)

## License

Slipmat is released under the [MIT License](/LICENSE).

---
Developed by [Chris Sloop](http://chrissloop.com/)
