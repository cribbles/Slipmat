Slipmat.Views.UserShow = Backbone.View.extend({

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
    this.$rootEl.before(header);
    this.$el.html(content);

    return this;
  },

  remove: function () {
    $(".profile-header").remove();
    Backbone.View.prototype.remove.call(this);
  }

});
