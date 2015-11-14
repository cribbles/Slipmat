Slipmat.Views.Index = Backbone.PaginatableView.extend({

  tagName: "main",
  className: "group",
  template: JST["root/index"],

  initialize: function (options) {
    this.spinner = options.spinner;
    this.collection = options.collection;
    this.subview = this.collection.subview;

    this.listenTo(this.collection, "sync", this.render);
  },

  events: {
    "click .nav-tabs > li": "switchTab"
  },

  render: function () {
    var content = this.template({ stats: this.collection.statistics() });
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

    var proto = $(e.currentTarget).attr("id");
    if (proto === this.collection.class) { return; }

    this.collection = new Slipmat.Collections[proto]();
    this.subview = this.collection.subview;
    this.stopListening();
    this.listenTo(this.collection, "sync", this.render);
    this.collection.fetch();
    this.transition();

    Backbone.history.navigate("#/" + this.collection.url.slice(4));
  },

  renderSubviews: function () {
    var $el = this.$(".content-records").empty();

    this.collection.forEach(record => {
      var content = this.subview({ model: record });
      $el.append(content);
    });
  }

});
