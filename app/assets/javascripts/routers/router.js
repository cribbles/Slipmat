Slipmat.Routers.Router = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.records = options.records;
  },

  routes: {
    "": "index",
    "search": "search",

    "records/new": "recordNew",
    "records/search": "recordSearch",
    "records/:id": "recordShow",
    "records/:id/edit": "recordEdit",

    "artists/:id": "artistShow",
    "artists/:id/edit": "artistEdit",

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

    "_=_": "_profile",
    "import/:id": "_import",
    "demo": "_demo"
  },

  index: function () {
    this.records.fetch();
    var view = new Slipmat.Views.Index({ collection: this.records });

    this._swapView(view);
  },

  search: function (query) {
    var results = new Slipmat.Collections.SearchResults();
    results.fetch({ data: query });
    var view = new Slipmat.Views.Search({ collection: results });

    this._swapView(view);
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
    this.userShow(Slipmat.currentUser.id, "profile");
  },

  wantlist: function () {
    if (!this._ensureSignedIn()) { return; }
    this.userShow(Slipmat.currentUser.id, "wantlist");
  },

  collection: function () {
    if (!this._ensureSignedIn()) { return; }
    this.userShow(Slipmat.currentUser.id, "collection");
  },

  sessionNew: function () {
    if (!this._ensureSignedOut()) { return; }

    var view = new Slipmat.Views.SessionForm();
    this._swapView(view);
  },

  sessionDelete: function () {
    Slipmat.currentUser.signOut();
    Backbone.history.navigate("/", { trigger: true });
  },

  _demo: function () {
    Slipmat.currentUser.signIn({
      username: "Sennacy",
      password: "password",
      success: function () {
        Backbone.history.navigate("/profile", { trigger: true });
      }
    })
  },

  _profile: function () {
    // redirects Facebook login
    Backbone.history.navigate("", { trigger: true });
  },

  _import: function (id) {
    Slipmat.import(id);
  },

  _ensureSignedIn: function (callback) {
    if (!Slipmat.currentUser.isSignedIn()) {
      if (!callback) {
        callback = Backbone.history.navigate("login", { trigger: true });
      }
      Slipmat.currentUser.signIn(callback);

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
