Slipmat.Routers.Router = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },

  routes: {
    "": "recordIndex",
    "records/new": "recordNew",
    "records/:id": "recordShow",
    "records/:id/edit": "recordEdit",
    "login": "sessionNew",
    "logout": "sessionDelete",
    "register": "userNew",
    "users/:id": "userShow",
    "users/:id/edit": "userEdit",
    "users/:id/:tab": "userShow",
    "profile": "profile",
    "wantlist": "wantlist",
    "collection": "collection"
  },

  recordIndex: function () {
    var records = new Slipmat.Collections.Records();
    records.fetch();

    var view = new Slipmat.Views.RecordIndex({ collection: records });
    this._swapView(view);
  },

  recordNew: function () {
    if (!this._ensureSignedIn()) { return; }

    var record = new Slipmat.Models.Record();
    var view = new Slipmat.Views.RecordForm({ model: record });

    this._swapView(view);
  },

  recordShow: function (id) {
    var record = new Slipmat.Models.Record({ id: id });
    record.fetch();

    var view = new Slipmat.Views.RecordShow({ model: record });
    this._swapView(view);
  },

  recordEdit: function (id) {
    if (!this._ensureSignedIn()) { return; }

    var record = new Slipmat.Models.Record({ id: id });
    record.fetch();

    var view = new Slipmat.Views.RecordForm({ model: record });

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
    Backbone.history.navigate("", { trigger: true });
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
    Backbone.history.navigate("", { trigger: true });
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
