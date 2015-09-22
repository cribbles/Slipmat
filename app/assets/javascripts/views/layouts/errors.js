Slipmat.Views.Errors = Backbone.View.extend({

  template: JST["shared/_errors"],

  initialize: function (options) {
    this.errors = options.errors;
  },

  render: function () {
    var content = this.template({ errors: this.errors });
    this.$el.html(content);

    return this;
  }
});
