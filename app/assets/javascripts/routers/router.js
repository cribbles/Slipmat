Slipmat.Routers.Router = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.countries = options.countries
  },

  routes: {
    "": "recordIndex",
    "records/new": "recordNew",
    "records/:id": "recordShow",
    "records/:id/edit": "recordEdit",
    "users/new": "userNew",
    "users/:id": "userShow"
  },

  recordIndex: function () {
    var records = new Slipmat.Collections.Records();
    records.fetch();

    var view = new Slipmat.Views.RecordIndex({ collection: records });

    this._swapView(view);
  },

  recordNew: function () {
    var record = new Slipmat.Models.Record();
    var view = new Slipmat.Views.RecordForm({
      model: record,
      countries: this.countries
    });

    this._swapView(view);
  },

  recordShow: function (id) {
    var record = new Slipmat.Models.Record({ id: id });
    record.fetch();

    var view = new Slipmat.Views.RecordShow({ model: record });
    this._swapView(view);
  },

  recordEdit: function (id) {
    var record = new Slipmat.Models.Record({ id: id });
    record.fetch();

    var view = new Slipmat.Views.RecordForm({
      model: record,
      countries: this.countries
    });

    this._swapView(view);
  },

  userNew: function () {
    var user = new Slipmat.Models.User();
    var view = new Slipmat.Views.UserForm({ model: user });

    this._swapView(view);
  },

  userShow: function (id) {
    var user = new Slipmat.Models.User({ id: id });
    user.fetch();

    var view = new Slipmat.Views.UserShow({
      $rootEl: this.$rootEl,
      model: user
    });

    this._swapView(view);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
