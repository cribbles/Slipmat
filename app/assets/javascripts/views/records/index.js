Slipmat.Views.RecordIndex = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/index"],

  initialize: function () {
    this.subview = JST["records/_record"];
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function () {
    var content = this.template({
      stats: this.collection.statistics()
    });
    this.$el.html(content);

    this.selectTab();
    this.renderPages();
    this.renderSubviews();

    return this;
  },

  selectTab: function (e) {
    this.$(".tabs > li").removeClass("selected");
    var $el = this.$("#" + this.collection.class);
    $el.addClass("selected");
  },

  paginate: function (e) {
    e.preventDefault();

    var page;
    var $el = $(e.currentTarget);
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

    var header = JST["records/_paginationHeader"]({ records: this.collection });
    this.$(".pagination-header").html(header);
    this.$(".page > span").on("click", this.paginate.bind(this));
  },

  renderSubviews: function () {
    this.$(".content-records").empty();

    var view = this;
    view.collection.each(function(record) {
      var content = view.subview({ model: record });
      view.$(".content-records").append(content);
    });
  }

});
