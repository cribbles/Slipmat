Backbone.PaginatableView = Backbone.View.extend({

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

  renderCollection: function () {
    this.renderPages();
    this.renderSubviews();
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

  remove: function () {
    this.$(".page > span").off();
    Backbone.View.prototype.remove.call(this);
  }

});