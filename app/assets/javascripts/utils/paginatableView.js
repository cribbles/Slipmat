Backbone.PaginatableView = Backbone.View.extend({

  paginate: function (e) {
    e.preventDefault();

    var page,
        fragment,
        token,
        query = this.query || {},
        pages = this.collection.pages(),
        $el = $(e.currentTarget),
        prevPage = $el.parent().hasClass("prev-page"),
        nextPage = $el.parent().hasClass("next-page");

    if (!$el.hasClass("link")) { return; }

    if (nextPage && pages.next_page) {
      page = pages.next_page;
    } else if (prevPage && pages.prev_page) {
      page = pages.prev_page;
    }
    query.page = page;

    this.transition();
    this.collection.fetch({
      data: query,
      success: () => {
        fragment = Backbone.history.getFragment().replace(/(\?|\&)page=\d/, "");
        token = (fragment.match(/\?/) ? "&" : "?");
        Backbone.history.navigate(fragment + token + "page=" + page);
      }
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
    }), footer = JST["layouts/_paginationFooter"]({
      collection: this.collection
    });

    this.$(".pagination-header").html(header);
    this.$(".pagination-footer").html(footer);
    this.$(".page > span").on("click", this.paginate.bind(this));
  },

  remove: function () {
    this.$(".page > span").off();
    Backbone.View.prototype.remove.call(this);
  },

  transition: function () {
    $(".content-records").html(this.spinner);
  }

});
