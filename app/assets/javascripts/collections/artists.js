Slipmat.Collections.Artists = Backbone.Collection.extend({

  url: "api/artists",
  model: Slipmat.Models.Artist,

  initialize: function () {
    this.proto = "Artists";
    this.subview = this.model.prototype.subview;
  },

  parse: function (payload) {
    this._statistics = payload.statistics;
    delete payload.statistics;

    this._pages = payload.pages;
    delete payload.pages;

    return payload.artists;
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
