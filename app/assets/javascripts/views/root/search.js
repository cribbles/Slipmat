Slipmat.Views.Search = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["root/search"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  events: {
    "click .nav-tabs > li": "switchTab"
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);
    this.renderCollection();

    return this;
  },

  renderCollection: function () {
    this.renderPages();
    this.renderSubviews();
  },

  paginate: function (e) {
    e.preventDefault();

    var $el = $(e.currentTarget);
    if (!$el.hasClass("link")) { return; }

    var page;
    var pages = this.collection.pages();
    var prevPage = $el.parent().hasClass("prev-page");
    var nextPage = $el.parent().hasClass("next-page");

    if (nextPage && pages.next_page) {
      page = pages.next_page;
    } else if (prevPage && pages.prev_page) {
      page = pages.prev_page;
    }
    this.collection.fetch({
      data: { page: page }
    });
  },

  renderPages: function () {
    this.$(".page > span").off();

    var header = JST["layouts/_paginationHeader"]({
      collection: this.collection
    });
    this.$(".pagination-header").html(header);

    var footer = JST["layouts/_paginationFooter"]({
      collection: this.collection
    });
    this.$(".pagination-footer").html(footer);

    this.$(".page > span").on("click", this.paginate.bind(this));
  },

  renderSubviews: function () {
    this.$(".content-records").empty();

    var view = this;
    view.collection.forEach(function(model) {
      var content = model.subview({ model: model });
      view.$(".content-records").append(content);
    });
  },

  remove: function () {
    this.$(".page > span").off();
    Backbone.View.prototype.remove.call(this);
  }

});
