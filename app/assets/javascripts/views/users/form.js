Slipmat.Views.UserNew = Backbone.View.extend({

  template: JST["users/new"],

  events: {
    "submit #new-user": "submit",
    "click .button-oauth": "redirect"
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var view = this;
    var $form = $(e.currentTarget);
    var attributes = $form.serializeJSON().user;

    this.model.save(attributes, {
      success: function (user) {
        var fragment = "//users/" + user.get("slug");
        Slipmat.currentUser.fetch();
        Backbone.history.navigate(fragment, { trigger: true });
      },
      error: function (model, resp) {
        Slipmat._onError(this, resp.responseJSON);
      }
    });
  },

  redirect: function (e) {
    e.preventDefault();

    var provider = $(e.currentTarget).attr("id");
    location.replace("/auth/" + provider);
  }

});
