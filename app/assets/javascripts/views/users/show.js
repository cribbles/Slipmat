Slipmat.Views.UserShow = Backbone.CompositeView.extend({

  tagName: "main",
  className: "group",
  template: JST["users/show"],

  initialize: function (options) {
    options = options || {};
    this.$rootEl = options.$rootEl;
    this.headerTemplate = JST["users/_userHeader"];

    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    $(".profile-header").remove();

    var header = this.headerTemplate({ user: this.model });
    var content = this.template({ user: this.model });
    var profile = JST["users/_profile"]({ user: this.model });

    this.$rootEl.before(header);
    this.$el.html(content);
    this.$(".profile-main").html(profile);

    $(".tab").on("click", this.switchTab.bind(this));
    return this;
  },

  remove: function () {
    $(".profile-header").remove();
    $(".tab").off("click");

    Backbone.View.prototype.remove.call(this);
  },

  switchTab: function (e) {
    e.preventDefault();

    var template = $(e.currentTarget).data("id");
    var content = JST["users/_" + template]({ user: this.model });

    this.$(".profile-main").html(content);

    if (list = $(e.currentTarget).data("list")) {
      this.renderList(list);
    }
  },

  renderList: function (list) {
    var view = this;
    var records = this.model[list]();
    var recordSubview = JST["records/_record"];
    var header = JST["records/_paginationHeader"]({ records: records });
    this.$(".pagination-header").append(header);

    records.each(function(record) {
      var subview = recordSubview({ record: record });

      view.$(".content-records").append(subview);
    });
  }

});
