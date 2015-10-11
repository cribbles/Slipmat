Slipmat.Views.Search = Backbone.PaginatableView.extend({

  tagName: "main",
  className: "group",
  template: JST["root/search"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  events: {
    "click button": "redirect"
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);
    this.$("h2").text("Search Results");
    this.renderPages();

    if (this.collection.length) {
      this.renderSubviews();
    } else {
      var content = JST["root/_nullSearchResults"]();
      this.$(".content-records").html(content);
    }
    return this;
  },

  renderSubviews: function () {
    this.$(".content-records").empty();

    var view = this;
    view.collection.forEach(function(model) {
      var content = model.subview({ model: model });
      view.$(".content-records").append(content);
    });
  },

  redirect: function () {
    Backbone.history.navigate("records/new", { trigger: true });
  }

});
