Slipmat.Views.UserNew = Backbone.CompositeView.extend({

  template: JST["users/new"],

  events: {
    "submit #new-user": "submit",
    "click .button-google": "redirect"
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
        Slipmat.currentUser.fetch();
        Backbone.history.navigate("#/users/" + user.id, { trigger: true });
      },
      error: function (model, resp) {
        Slipmat._onError(this, resp.responseJSON);
      }
    });
  },

  redirect: function (e) {
    e.preventDefault();
    location.replace("/auth/google_oauth2");
  }
});
