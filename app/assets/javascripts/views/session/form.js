Slipmat.Views.SessionForm = Backbone.View.extend({

  template: JST["session/form"],

  events: {
    "submit #new-session": "submit"
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var view = this;
    var $form = $(e.currentTarget);
    var credentials = $form.serializeJSON();

    Slipmat.currentUser.signIn({
      username: credentials.username,
      password: credentials.password,
      success: function (user) {
        Backbone.history.navigate("#/users/" + user.id, { trigger: true });
      },
      error: function (resp) {
        Slipmat._onError(view, resp.responseJSON);
      }
    });
  }
});
