Slipmat.Collections.SearchResults = Backbone.Collection.extend({

  url: "api/search",

  parse: function (payload) {
    this._pages = payload.pages;
    delete payload.pages;

    return payload.results;
  },

  model: function (attributes) {
    var proto = attributes.searchable_type;
    delete attributes.searchable_type;

    return new Slipmat.Models[proto](attributes);
  }

});
