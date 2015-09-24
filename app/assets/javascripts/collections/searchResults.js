Slipmat.Collections.SearchResults = Backbone.Collection.extend({

  proto: "All",
  url: "api/search",
  model: Slipmat.Models.SearchResult,

  parse: function (payload) {
    this._pages = payload.pages;
    delete payload.pages;

    return payload.results;
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
