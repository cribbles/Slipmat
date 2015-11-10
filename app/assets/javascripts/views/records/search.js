Slipmat.Views.RecordSearch = Backbone.PaginatableView.extend({

  tagName: "main",
  className: "group",
  template: JST["root/search"],

  initialize: function (options) {
    this.query = options.query;
    this.spinner = options.spinner;

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
    var headerText,
        sort = this.collection._sort;

    if (!sort) {
      headerText = "Search Results";
    } else {
      headerText = "Records by " + sort.type + ": " + sort.value;
    }

    this.$("h2").text(headerText);
  },

  renderSubviews: function () {
    var $el = this.$(".content-records").empty();

    this.collection.forEach(model => {
      var content = model.subview({ model: model });
      $el.append(content);
    });
  }

});
