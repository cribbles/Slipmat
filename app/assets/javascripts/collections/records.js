Slipmat.Collections.Records = Backbone.Collection.extend({

  url: "api/records",

  model: Slipmat.Models.Record,

  hasRecord: function (model) {
    return this.some(function (record) {
      return record.id === Number(model.id);
    });
  }

});
