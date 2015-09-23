Slipmat.Collections.Labels = Backbone.Collection.extend({

  url: "api/labels",

  model: Slipmat.Models.Label,

  initialize: function () {
    this.proto = "Labels";
    this.subview = JST["labels/_label"];
  },

  parse: function (payload) {
    this._statistics = payload.statistics;
    delete payload.statistics;

    this._pages = payload.pages;
    delete payload.pages;

    return payload.labels;
  },

  statistics: function () {
    this._statistics = this._statistics || {};
    return this._statistics;
  },

  pages: function () {
    this._pages = this._pages || {};
    return this._pages;
  }

});
