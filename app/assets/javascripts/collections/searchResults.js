Slipmat.Collections.SearchResults = Backbone.Collection.extend({

  proto: "All",
  url: "api/search",

  parse: function (payload) {
    this._pages = payload.pages;
    delete payload.pages;

    return payload.results;
  },

  model: function (attributes) {
    var proto = attributes.searchable_type;
    delete attributes.searchable_type;

    return new Slipmat.Models[proto](attributes, { parse: true });
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
