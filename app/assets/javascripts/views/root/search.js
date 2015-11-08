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
    var placeholder = JST["root/_nullSearchResults"](),
        content = this.template();
    this.$el.html(content);
    this.$("h2").text("Search Results");
    this.renderPages();

    if (this.collection.length) {
      this.renderSubviews();
    } else {
      this.$(".content-records").html(placeholder);
    }
    return this;
  },

  renderSubviews: function () {
    var content, $el = this.$(".content-records");
    $el.empty();

    this.collection.forEach(function (model) {
      content = model.subview({ model: model });
      $el.append(content);
    });
  },

  redirect: function () {
    Backbone.history.navigate("records/new", { trigger: true });
  }

});
