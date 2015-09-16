Slipmat.Routers.Router = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.countries = options.countries
  },

  routes: {
    "": "recordIndex",
    "records/new": "recordNew",
    "records/:id": "recordShow",
    "records/:id/edit": "recordEdit"
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

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
