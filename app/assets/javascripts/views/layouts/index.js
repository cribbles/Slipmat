Slipmat.Views.Index = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["layouts/index"],

  initialize: function (options) {
    this.subview = "Record";
    this.artists = options.artists;
    this.records = options.records;
    this.labels = options.labels;

    this.listenTo(this.collection, "sync", this.render);
  },

  events: {
    "click .collection-tab": "switchTab"
  },

  render: function () {
    var content = this.template({ collection: this.collection });

    this.$el.html(content);
    this.renderSubviews();

    return this;
  },

  renderSubviews: function () {
    var header = JST["layouts/_paginationHeader"]({
      collection: this.collection
    });
    this.$(".pagination-header").html(header);

    this.collection.each(function(model) {
      var subview = new Slipmat.Views[subview]();

      this.$(".content-records", subview);
    }.bind(this));
  },

  switchTab: function (e) {
    e.preventDefault();

    this.subview = $(e.currentTarget).data("subview");
    this.collection = this[$(e.currentTarget).data("collection")];
    this.collection.fetch();

    this._removeSubviews();
    this.$(".content-records").empty();

    this.renderSubviews();
  },

  _removeSubviews: function() {
    this.eachSubview(function (subview) {
      subview.remove();
    });
  }

});
