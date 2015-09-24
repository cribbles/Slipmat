Slipmat.Collections.FilterResults = Backbone.Collection.extend({

  proto: "All",
  url: "api/records/search",

  model: function (attributes) {
    return new Slipmat.Models.Record(attributes, { parse: true });
  },

  parse: function (payload) {
    this._sort = payload.sort;
    this._pages = payload.pages;
    delete payload.pages;

    return payload.records;
  },

  pages: function () {
    this._pages = this._pages || {
      upper_limit: 0,
      lower_limit: 0,
      total_count: "None"
    };
    return this._pages;
  }

});
