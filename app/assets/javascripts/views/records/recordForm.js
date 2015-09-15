Slipmat.Views.RecordForm = Backbone.View.extend({

  template: JST["records/form"],

  events: {
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);

    return this;
  }

});
