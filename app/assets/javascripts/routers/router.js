Slipmat.Routers.Router = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.records = options.records;
    this.artists = options.artists;
    this.labels = options.labels;
    this.spinner = options.spinner;

    this._transition();
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
    "logout": "sessionDestroy",
    "register": "userNew",

    "profile": "profile",
    "wantlist": "wantlist",
    "collection": "collection",

    "_=_": "_goHome",
    "import/:id": "_import",
    "demo": "_demo"
  },

  index: function (query, options) {
    var query = query || {},
        options = options || {},
        collection = options.collection || this.records;

    collection.fetch({
      data: {
        order: query.order,
        page: Number(query.page)
      },
      success: () => {
        var view = new Slipmat.Views.Index({
          collection: collection,
          spinner: this.spinner
        });
        this._swapView(view);
      }
    });
  },

  search: function (query) {
    var results = new Slipmat.Collections.SearchResults();

    results.fetch({
      data: query,
      success: () => {
        var view = new Slipmat.Views.Search({ collection: results });
        this._swapView(view);
      }
    });
  },

  recordsIndex: function (query) {
    options = { collection: this.records };
    this.index(query, options);
  },

  recordNew: function () {
    if (!this._ensureSignedIn()) { return; }

    var record = new Slipmat.Models.Record(),
        view = new Slipmat.Views.RecordForm({ model: record });

    this._swapView(view);
  },

  recordSearch: function (query) {
    var results = new Slipmat.Collections.FilterResults();

    this._transition();
    results.fetch({
      data: query,
      success: (results) => {
        delete query.page;
        var view = new Slipmat.Views.RecordSearch({
          query: query,
          collection: results,
          spinner: this.spinner
        });
        this._swapView(view);
      }
    });
  },

  recordShow: function (id) {
    this.records.getOrFetch(id, (record) => {
      var view = new Slipmat.Views.RecordShow({
        model: record,
        router: this
      });
      this._swapView(view);
    });
    this._transition();
  },

  recordEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    this.records.getOrFetch(id, (record) => {
      var view = new Slipmat.Views.RecordForm({ model: record });
      this._swapView(view);
    });
  },

  artistsIndex: function (query) {
    options = { collection: this.artists };
    this.index(query, options);
  },

  artistShow: function (id) {
    var artist = new Slipmat.Models.Artist({ id: id });

    artist.fetch({
      success: (artist) => {
        var view = new Slipmat.Views.ArtistShow({
          model: artist,
          router: this
        });
        this._swapView(view);
      }
    });
  },

  artistEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }
    var artist = new Slipmat.Models.Artist({ id: id });

    artist.fetch({
      success: (artist) => {
        var view = new Slipmat.Views.ArtistEdit({ model: artist });
        this._swapView(view);
      }
    });
  },

  labelsIndex: function (query) {
    options = { collection: this.labels };
    this.index(query, options);
  },

  labelShow: function (id) {
    var label = new Slipmat.Models.Label({ id: id });

    label.fetch({
      success: (label) => {
        var view = new Slipmat.Views.LabelShow({
          model: label,
          router: this
        });
        this._swapView(view);
      }
    });
  },

  labelEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }
    var label = new Slipmat.Models.Label({ id: id });

    label.fetch({
      success: (label) => {
        var view = new Slipmat.Views.LabelEdit({ model: label });
        this._swapView(view);
      }
    });
  },

  userNew: function () {
    if (!this._ensureSignedOut()) { return; }

    var user = new Slipmat.Models.User(),
        view = new Slipmat.Views.UserNew({ model: user });

    this._swapView(view);
  },

  userEdit: function (slug) {
    if (!this._ensureSignedIn()) { return; }
    if (slug !== Slipmat.currentUser.get("slug")) {
      this._goHome();
      return;
    }

    var view,
        user = new Slipmat.Models.User(Slipmat.currentUser.attributes);

    user._image = Slipmat.currentUser._image;
    view = new Slipmat.Views.UserEdit({ model: user });

    this._swapView(view);
  },

  userShow: function (id, tab) {
    var user = new Slipmat.Models.User({ id: id });

    user.fetch({
      success: (user) => {
        var view = new Slipmat.Views.UserShow({
          $rootEl: this.$rootEl,
          model: user,
          tab: (tab || "profile")
        });
        this._swapView(view);
      }
    });
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

  sessionDestroy: function () {
    Slipmat.currentUser.signOut();
    this._goHome();
  },

  _import: function (id) {
    Slipmat.import(id);
  },

  _ensureSignedIn: function (options) {
    options = options || {};
    var view, fragment;

    if (!Slipmat.currentUser.isSignedIn()) {
      if (!options.success) {
        fragment = Backbone.history.fragment;
        options.success = () => {
          Backbone.history.fragment = null;
          Backbone.history.navigate(fragment, { trigger: true });
        };
      }
      if (!options.error) {
        options.error = () => {
          view = new Slipmat.Views.SessionForm();
          this._swapView(view);
        };
      }
      Slipmat.currentUser.fetch(options);
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

  _transition: function () {
    this._currentView && this._currentView.remove();
    this.$rootEl.html(this.spinner);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
    window.scrollTo(0, 0);
  }

});
