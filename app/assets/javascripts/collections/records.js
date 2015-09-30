Slipmat.Collections.Records = Backbone.Collection.extend({

  url: "api/records",
  model: Slipmat.Models.Record,

  initialize: function () {
    this.proto = "Records";
    this.subview = this.model.prototype.subview;
  },

  parse: function (payload) {
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
    this._pages = this._pages || {
      upper_limit: 0,
      lower_limit: 0,
      total_count: "None"
    };
    return this._pages;
  },

  hasRecord: function (model) {
    return this.some(function (record) {
      return record.id === Number(model.id);
    });
  },

  getOrFetch: function (id, callback) {
    var model = this.get(id);
    var onSuccess = function (model) {
      callback && callback(model);
    }

    if (model) {
      model.fetch({ success: onSuccess });
    } else {
      var collection = this;
      model = new this.model({ id: id });
      collection.add(model);

      model.fetch({
        success: onSuccess,
        error: function () {
          collection.remove(model);
        }
      });
    }

    return model;
  }

});
