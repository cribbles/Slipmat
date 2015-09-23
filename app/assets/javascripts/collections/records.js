Slipmat.Collections.Records = Backbone.Collection.extend({

  url: "api/records",

  model: Slipmat.Models.Record,

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
