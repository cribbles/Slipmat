Slipmat.Views.RecordSearch = Backbone.PaginatableView.extend({

  tagName: "main",
  className: "group",
  template: JST["root/search"],

  initialize: function (options) {
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);
    this.renderHeader();
    this.renderCollection();

    return this;
  },

  renderHeader: function () {
    var headerText;
    var sort = this.collection._sort;

    if (!sort) {
      headerText = "Search Results";
    } else {
      headerText = "Records by " + sort.type + ": " + sort.value;
    }

    this.$("h2").text(headerText);
  },

  renderSubviews: function () {
    this.$(".content-records").empty();

    var view = this;
    view.collection.forEach(function(model) {
      var content = model.subview({ model: model });
      view.$(".content-records").append(content);
    });
  }

});
