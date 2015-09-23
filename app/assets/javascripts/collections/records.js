Slipmat.Collections.Records = Backbone.Collection.extend({

  url: "api/records",
  model: Slipmat.Models.Record,

  parse: function (payload) {
    this.class = "Record";

    this._statistics = payload.statistics;
    delete payload.statistics;

    this._pages = payload.pages;
    delete payload.pages;

    return payload.records;
  },

  statistics: function () {
    this._statistics = this._statistics || {};
    return this._statistics;
  },

  pages: function () {
    this._pages = this._pages || {};
    return this._pages;
  },

  hasRecord: function (model) {
    return this.some(function (record) {
      return record.id === Number(model.id);
    });
  },

  getOrFetch: function (id) {
    var model = this.get(id);

    if (model) {
      model.fetch();
    } else {
      var collection = this;
      model = new this.model({ id: id });
      collection.add(model);

      model.fetch({
        error: function () {
          collection.remove(model);
        }
      });
    }

    return model;
  }

});
