# Slipmat

[Heroku link][heroku]

[heroku]: http://slipmat.herokuapp.com

## Minimum Viable Product
Slipmat is a clone of Discogs built on Rails and Backbone. Users can:

- [X] View records
- [X] Add and update records
- [X] Create accounts
- [X] Create sessions (log in)
- [ ] Update their profile
- [X] Add records to their wantlist and collection
- [X] View other users' profiles, wantlists, and collections
- [ ] See their own and others' recent activity
- [ ] View artists and labels
- [ ] Comment on records, artists and labels
- [ ] Search for records, artists and labels
- [ ] Filter records, artists and labels

## Design Docs
* [View Wireframes][views]
* [DB schema][schema]

[views]: ./docs/views.md
[schema]: ./docs/schema.md

## Implementation Timeline

### Phase 1: Displaying, Adding and Editing Records (~1 day)
I will create the API endpoints for my `records` table, along with the
`RecordsIndex`, `RecordShow` and `RecordForm` Backbone views. `RecordsIndex`
will be a composite view comprised of many `RecordsIndexItem` subviews.

This phase will also involve making a couple of minimal `Genre` and `Style`
tables and corresponding join tables to allow inventoried records to be
'tagged' with genres and styles.

I will conclude this phase by making sure everything deploys properly with
Heroku.

[Details][phase-one]

### Phase 2: User Authentication, User Profile (~1 days)
I will implement Rails user authentication including sign up, sign in, and
sign out. Users will be able to fill out a short profile and upload a picture
of themselves using Filepicker - at this stage I will also refactor my
`RecordForm` view to enable users to upload record covers.

[Details][phase-two]

### Phase 3: Collections, Wantlists, Comments, and Recent Activity (~1-2 days)
I will enable users to add records to (and remove records from) their
Wantlist or Collection, via the `RecordShow` page. I will expand user profiles
by creating views for a `UserWantlist` and `UserCollection`, each a composite
view populated with `UserListItem` elements. `UserWantlist`s and
`UserCollections` will each represent different types of `Record` collections
(nice how that works out, isn't it?)

Finally, I will create a `UserActivity` join table to keep track of user
contributions (adding / updating records), collections and wantlists. I will
display recent activity in the `UserShow` view. Rails will be responsible for
updating the `UserActivity` table in coordination with relevant actions.

[Details][phase-three]

### Phase 4: Artists and Labels (~1 day)
I will create `ArtistShow` and `LabelShow` views to display records for a
given artist and label.  Each will be a composite view with corresponding
`ArtistItemShow`/`LabelItemShow` subviews.  Users will be able to update
artist and label information (including images) on these pages.

This will involve a slight refactor of the `RecordForm` - users will be
prompted to select from a list of existing artists when submitting a new
record, or to type out the name of a new one. Ditto with labels.

[Details][phase-four]

### Phase 5: Record, Artist, and Label Comments (~1 day)
I will create a `CommentForm` subview to enable users to leave comments on
record, artist, and label pages. The `RecordShow`, `ArtistShow`, and `LabelShow`
views will make use of a `UserComments` composite subview with many
`UserCommentItem` subviews. `Comments` will be a singular SQL item with
a polymorphic relationship to its subject.

[Details][phase-five]

### Phase 6: Searching for Records, Artists, and Labels (~1-2 days)
I will create API endpoints to search for records, artists, and labels by
title/name. I will integrate a live search into the header nav-bar's search
field.

[Details][phase-six]

### Phase 7: Filtering Records, Artists and Labels (~1-2 days)
I will improve my search API to enable filtering records by genre, style,
country, and decade; artists and labels by decade. Users will be able to use
the front page of the site to create stackable search parameters.

[Details][phase-seven]

### Bonus Features (TBD)
- [ ] Ratings for records (5 star scale)
- [ ] Git diff / wiki like updates for records, artists, and labels
- [ ] Comment on comments
- [ ] Multiple formats and releases (CD, Cassette, Reissue, Deluxe, etc.)
- [ ] Buy and sell records
- [ ] User messaging
- [ ] Add records to lists (Best Reggae records of the 90s, etc.)

[phase-one]: ./docs/phases/phase1.md
[phase-two]: ./docs/phases/phase2.md
[phase-three]: ./docs/phases/phase3.md
[phase-four]: ./docs/phases/phase4.md
[phase-five]: ./docs/phases/phase5.md
[phase-six]: ./docs/phases/phase6.md
[phase-seven]: ./docs/phases/phase7.md
