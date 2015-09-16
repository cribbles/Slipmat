Slipmat.Views.RecordShow = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);

    return this;
  }

});
