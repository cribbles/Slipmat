Slipmat.Routers.Router = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.records = options.records;
    this.artists = options.artists;
    this.labels = options.labels;
  },

  routes: {
    "": "index",
    "search": "search",

    "records": "index",
    "records/new": "recordNew",
    "records/search": "recordSearch",
    "records/:id": "recordShow",
    "records/:id/edit": "recordEdit",

    "artists": "artistsIndex",
    "artists/:id": "artistShow",
    "artists/:id/edit": "artistEdit",

    "labels": "labelsIndex",
    "labels/:id": "labelShow",
    "labels/:id/edit": "labelEdit",

    "users/:id": "userShow",
    "users/:id/edit": "userEdit",
    "users/:id/:tab": "userShow",

    "login": "sessionNew",
    "logout": "sessionDelete",
    "register": "userNew",

    "profile": "profile",
    "wantlist": "wantlist",
    "collection": "collection",

    "_=_": "_goHome",
    "import/:id": "_import",
    "demo": "_demo"
  },

  index: function (query, options) {
    query = query || {};
    options = options || {};
    collection = options.collection || this.records;
    collection.fetch({
      data: { page: Number(query.page) }
    });

    var view = new Slipmat.Views.Index({ collection: collection });

    this._swapView(view);
  },

  search: function (query) {
    var results = new Slipmat.Collections.SearchResults();
    results.fetch({ data: query });
    var view = new Slipmat.Views.Search({ collection: results });

    this._swapView(view);
  },

  recordsIndex: function (query) {
    options = { collection: this.records };
    this.index(query, options);
  },

  recordNew: function () {
    if (!this._ensureSignedIn()) { return; }

    var record = new Slipmat.Models.Record();
    var view = new Slipmat.Views.RecordForm({ model: record });

    this._swapView(view);
  },

  recordSearch: function (query) {
    var results = new Slipmat.Collections.FilterResults();
    results.fetch({ data: query });
    delete query.page;

    var view = new Slipmat.Views.RecordSearch({
      query: query,
      collection: results
    });

    this._swapView(view);
  },

  recordShow: function (id) {
    var record = this.records.getOrFetch(id);
    var view = new Slipmat.Views.RecordShow({ model: record });

    this._swapView(view);
  },

  recordEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var record = this.records.getOrFetch(id);
    var view = new Slipmat.Views.RecordForm({ model: record });

    this._swapView(view);
  },

  artistsIndex: function (query) {
    options = { collection: this.artists };
    this.index(query, options);
  },

  artistShow: function (id) {
    var artist = new Slipmat.Models.Artist({ id: id });
    artist.fetch();
    var view = new Slipmat.Views.ArtistShow({ model: artist });

    this._swapView(view);
  },

  artistEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var artist = new Slipmat.Models.Artist({ id: id });
    artist.fetch();
    var view = new Slipmat.Views.ArtistEdit({ model: artist });

    this._swapView(view);
  },

  labelsIndex: function (query) {
    options = { collection: this.labels };
    this.index(query, options);
  },

  labelShow: function (id) {
    var label = new Slipmat.Models.Label({ id: id });
    label.fetch();
    var view = new Slipmat.Views.LabelShow({ model: label });

    this._swapView(view);
  },

  labelEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var label = new Slipmat.Models.Label({ id: id });
    label.fetch();
    var view = new Slipmat.Views.LabelEdit({ model: label });

    this._swapView(view);
  },

  userNew: function () {
    if (!this._ensureSignedOut()) { return; }

    var user = new Slipmat.Models.User();
    var view = new Slipmat.Views.UserNew({ model: user });

    this._swapView(view);
  },

  userEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var user = new Slipmat.Models.User(Slipmat.currentUser.attributes);
    user._image = Slipmat.currentUser._image;
    var view = new Slipmat.Views.UserEdit({ model: user });

    this._swapView(view);
  },

  userShow: function (id, tab) {
    var user = new Slipmat.Models.User({ id: id });
    user.fetch();

    var view = new Slipmat.Views.UserShow({
      $rootEl: this.$rootEl,
      model: user,
      tab: (tab || "profile")
    });

    this._swapView(view);
  },

  profile: function () {
    if (!this._ensureSignedIn()) { return; }
    this.userShow(Slipmat.currentUser.get("slug"), "profile");
  },

  wantlist: function () {
    if (!this._ensureSignedIn()) { return; }
    this.userShow(Slipmat.currentUser.get("slug"), "wantlist");
  },

  collection: function () {
    if (!this._ensureSignedIn()) { return; }
    this.userShow(Slipmat.currentUser.get("slug"), "collection");
  },

  sessionNew: function () {
    if (!this._ensureSignedOut()) { return; }

    var view = new Slipmat.Views.SessionForm();
    this._swapView(view);
  },

  sessionDelete: function () {
    Slipmat.currentUser.signOut();
    this._goHome();
  },

  _demo: function () {
    var success = this._goHome;

    Slipmat.currentUser.signIn({
      username: "Sennacy",
      password: "password",
      success: success
    })
  },

  _import: function (id) {
    Slipmat.import(id);
  },

  _ensureSignedIn: function (options) {
    options = options || {};

    if (!Slipmat.currentUser.isSignedIn()) {
      if (!options.success) {
        options.success = function () {
          var fragment = Backbone.history.fragment;
          Backbone.history.navigate(fragment, { trigger: true });
        }
      }
      if (!options.error) {
        options.error = function () {
          Backbone.history.navigate("/login", { trigger: true });
        }
      }
      Slipmat.currentUser.signIn(options);
      return false;
    }
    return true;
  },

  _ensureSignedOut: function (callback) {
    if (Slipmat.currentUser.isSignedIn()) {
      callback = callback || this._goHome.bind(this);
      callback();

      return false;
    }
    return true;
  },

  _goHome: function () {
    Backbone.history.navigate("/", { trigger: true });
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
