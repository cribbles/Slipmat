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
    this.renderCollection();

    return this;
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
