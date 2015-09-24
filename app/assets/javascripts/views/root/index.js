Slipmat.Views.Index = Backbone.PaginatableView.extend({

  tagName: "main",
  className: "group",
  template: JST["root/index"],

  initialize: function () {
    this.subview = this.collection.subview;
    this.listenTo(this.collection, "sync", this.render);
  },

  events: {
    "click .nav-tabs > li": "switchTab"
  },

  render: function () {
    var content = this.template({
      stats: this.collection.statistics()
    });
    this.$el.html(content);
    this.selectTab();
    this.renderCollection();

    return this;
  },

  selectTab: function () {
    this.$(".nav-tabs > li").removeClass("selected");
    this.$("#" + this.collection.proto).addClass("selected");
  },

  switchTab: function (e) {
    e.preventDefault();

    var $proto = $(e.currentTarget).attr("id");
    if ($proto === this.collection.class) { return; }

    this.stopListening();
    this.collection = new Slipmat.Collections[$proto]();
    this.subview = this.collection.subview;
    this.listenTo(this.collection, "sync", this.render);
    this.collection.fetch();
  },

  renderSubviews: function () {
    this.$(".content-records").empty();

    var view = this;
    view.collection.forEach(function(record) {
      var content = view.subview({ model: record });
      view.$(".content-records").append(content);
    });
  }

});
