Slipmat.Routers.Router = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },

  routes: {
    "records/new": "recordNew"
  },

  recordNew: function () {
    var record = new Slipmat.Models.Record();
    var view = new Slipmat.Views.RecordForm({
      model: record
    });

    this._swapView(view);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }

});
