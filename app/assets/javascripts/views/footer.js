Slipmat.Views.Footer = Backbone.View.extend({

  template: JST["layouts/footer/footer"],

  render: function () {
    var content = this.template();
    this.$el.html(content);

    return this;
  }

});
