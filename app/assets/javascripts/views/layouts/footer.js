Slipmat.Views.Footer = Backbone.View.extend({

  tagName: "footer",
  className: "footer",
  template: JST["layouts/footer/footer"],

  render: function () {
    var content = this.template();
    this.$el.html(content);

    return this;
  }

});
