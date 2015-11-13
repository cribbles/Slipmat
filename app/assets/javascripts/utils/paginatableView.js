Backbone.PaginatableView = Backbone.View.extend({

  paginate: function (e) {
    e.preventDefault();

    var query = this.query || {},
        $el = $(e.currentTarget);

    if (!$el.hasClass("link")) { return; }

    query.page = this._page($el);
    query.order = this._order();

    this.transition();
    this.collection.fetch({
      data: query,
      success: () => {
        var fragment = this._newFragment(query.page);
        Backbone.history.navigate(fragment);
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
    return this;
  },

  _page: function ($el) {
    var pages = this.collection.pages(),
      prevPage = $el.parent().hasClass("prev-page"),
      nextPage = $el.parent().hasClass("next-page");

    if (nextPage && pages.next_page) {
      return pages.next_page;
    } else if (prevPage && pages.prev_page) {
      return pages.prev_page;
    }
  },

  _order: function () {
    var matchData = Backbone.history.getFragment().match(/order=([a-z\,]+)/i);
    return matchData && matchData[1];
  },

  _newFragment: function (page) {
    var fragment = Backbone.history.getFragment(),
        pageRegExp = /((\?|\&)page=)\d/;

    if (!fragment.match(pageRegExp)) {
      return fragment + (fragment.match(/\?/) ? "&" : "?") + "page=" + page;
    } else {
      return fragment.replace(pageRegExp, "$1" + page);
    }
  }

});
