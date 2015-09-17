Slipmat.Views.RecordIndex = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/index"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function () {
    var content = this.template({ records: this.collection });
    this.$el.html(content);

    return this;
  }

});
