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

  events: {
    "click #tab": "switchTab"
  },

  render: function () {
    $(".profile-header").remove();

    var header = this.headerTemplate({ user: this.model });
    var content = this.template({ user: this.model });
    var recentActivity = JST["users/_recentActivity"]({ user: this.model });
    this.$rootEl.before(header);
    this.$el.html(content);
    this.$(".profile-main").html(recentActivity);

    return this;
  },

  remove: function () {
    $(".profile-header").remove();
    Backbone.View.prototype.remove.call(this);
  },

  switchTab: function (e) {

  }

});
