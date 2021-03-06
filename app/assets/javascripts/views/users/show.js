Slipmat.Views.UserShow = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["users/show"],

  initialize: function (options) {
    options = options || {};
    this.$rootEl = options.$rootEl;
    this.tab = options.tab || "profile";
    this.headerTemplate = JST["users/_userHeader"];

    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    $(".profile-header").remove();

    var header = this.headerTemplate({ user: this.model }),
        content = this.template({ user: this.model });

    this.$rootEl.before(header);
    this.$el.html(content);
    this.renderTab();

    $(".tab").on("click", this.switchTab.bind(this));
    return this;
  },

  switchTab: function (e) {
    e.preventDefault();

    this.tab = $(e.currentTarget).attr("id");
    this.renderTab();

    var fragment = "users/" + this.model.get("slug") + "/" + this.tab;
    Backbone.history.navigate(fragment);
  },

  renderTab: function () {
    var content = JST["users/_" + this.tab]({ user: this.model });
    this.$(".profile-main").html(content);

    if (this.tab === "wantlist") {
      this.renderCollection(this.model.wantedRecords());
    } else if (this.tab === "collection") {
      this.renderCollection(this.model.collectedRecords());
    }
  },

  renderCollection: function (collection) {
    var subview,
        recordSubview = JST["records/_record"],
        header = JST["layouts/_paginationHeader"]({ collection: collection }),
        footer = JST["layouts/_paginationFooter"]({ collection: collection }),
        $el = this.$(".content-records");

    this.$(".pagination-header").html(header);
    this.$(".pagination-footer").html(footer);

    collection.each(function (record) {
      subview = recordSubview({ model: record });
      $el.append(subview);
    });
  },

  remove: function () {
    $(".profile-header").remove();
    $(".tab").off("click");

    Backbone.View.prototype.remove.call(this);
  }

});
