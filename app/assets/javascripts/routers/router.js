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
    var view,
        router = this,
        query = query || {},
        options = options || {},
        collection = options.collection || this.records;

    collection.fetch({
      data: { page: Number(query.page) },
      success: function () {
        view = new Slipmat.Views.Index({
          collection: collection,
          spinner: router.spinner
        });
        router._swapView(view);
      }
    });
  },

  search: function (query) {
    var view,
        router = this,
        results = new Slipmat.Collections.SearchResults();

    results.fetch({
      data: query,
      success: function () {
        view = new Slipmat.Views.Search({ collection: results });
        router._swapView(view);
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
    var view,
        router = this,
        results = new Slipmat.Collections.FilterResults();

    this._transition();
    results.fetch({
      data: query,
      success: function (results) {
        delete query.page;
        view = new Slipmat.Views.RecordSearch({
          query: query,
          collection: results,
          spinner: router.spinner
        });
        router._swapView(view);
      }
    });
  },

  recordShow: function (id) {
    var view, router = this;
    this.records.getOrFetch(id, function (record) {
      view = new Slipmat.Views.RecordShow({
        model: record,
        router: router
      });
      router._swapView(view);
    });
    this._transition();
  },

  recordEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var view, router = this;
    this.records.getOrFetch(id, function (record) {
      view = new Slipmat.Views.RecordForm({ model: record });
      router._swapView(view);
    });
  },

  artistsIndex: function (query) {
    options = { collection: this.artists };
    this.index(query, options);
  },

  artistShow: function (id) {
    var view,
        router = this,
        artist = new Slipmat.Models.Artist({ id: id });

    artist.fetch({
      success: function (artist) {
        view = new Slipmat.Views.ArtistShow({
          model: artist,
          router: router
        });
        router._swapView(view);
      }
    });
  },

  artistEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var view,
        router = this,
        artist = new Slipmat.Models.Artist({ id: id });

    artist.fetch({
      success: function (artist) {
        view = new Slipmat.Views.ArtistEdit({ model: artist });
        router._swapView(view);
      }
    });
  },

  labelsIndex: function (query) {
    options = { collection: this.labels };
    this.index(query, options);
  },

  labelShow: function (id) {
    var view,
        router = this,
        label = new Slipmat.Models.Label({ id: id });

    label.fetch({
      success: function (label) {
        view = new Slipmat.Views.LabelShow({
          model: label,
          router: router
        });
        router._swapView(view);
      }
    });
  },

  labelEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var view,
        router = this,
        label = new Slipmat.Models.Label({ id: id });

    label.fetch({
      success: function (label) {
        view = new Slipmat.Views.LabelEdit({ model: label });
        router._swapView(view);
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
    var view,
        router = this,
        user = new Slipmat.Models.User({ id: id });

    user.fetch({
      success: function (user) {
        view = new Slipmat.Views.UserShow({
          $rootEl: router.$rootEl,
          model: user,
          tab: (tab || "profile")
        });
        router._swapView(view);
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
    var view, router, fragment;

    if (!Slipmat.currentUser.isSignedIn()) {
      if (!options.success) {
        fragment = Backbone.history.fragment;
        options.success = function () {
          Backbone.history.fragment = null;
          Backbone.history.navigate(fragment, { trigger: true });
        };
      }
      if (!options.error) {
        router = this;
        options.error = function () {
          view = new Slipmat.Views.SessionForm();
          router._swapView(view);
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
