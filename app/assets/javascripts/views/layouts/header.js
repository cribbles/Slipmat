Slipmat.Views.Header = Backbone.View.extend({

  tagName: "header",
  className: "header",
  template: JST["layouts/header/header"],

  render: function () {
    var content = this.template();
    this.$el.html(content);

    return this;
  }

});
