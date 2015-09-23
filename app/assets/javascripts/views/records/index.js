Slipmat.Views.RecordIndex = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/index"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  events: {
    "click .page > span": "paginate"
  },

  render: function () {
    var content = this.template({ records: this.collection });

    this.$el.html(content);
    this.renderPages();
    this.renderSubviews();

    return this;
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
    var header = JST["records/_paginationHeader"]({ records: this.collection });
    this.$(".pagination-header").html(header);
  },

  renderSubviews: function () {
    this.$(".content-records").empty();

    var view = this;
    var template = JST["records/_record"];

    this.collection.each(function(record) {
      var content = template({ record: record });
      view.$(".content-records").append(content);
    });
  }

});
