Slipmat.Views.UserShow = Backbone.CompositeView.extend({

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

    var header = this.headerTemplate({ user: this.model });
    var content = this.template({ user: this.model });

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

    var queryString = "users/" + this.model.id + "/" + this.tab;
    Backbone.history.navigate(queryString);
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
    var view = this;
    var recordSubview = JST["records/_record"];
    var header = JST["records/_paginationHeader"]({ records: collection });
    this.$(".pagination-header").append(header);

    collection.each(function(record) {
      var subview = recordSubview({ record: record });

      view.$(".content-records").append(subview);
    });
  },

  remove: function () {
    $(".profile-header").remove();
    $(".tab").off("click");

    Backbone.View.prototype.remove.call(this);
  }

});
