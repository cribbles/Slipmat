Slipmat.Views.SessionForm = Backbone.View.extend({

  template: JST["session/form"],

  events: {
    "submit #new-session": "submit",
    "click #demo-user": "demo",
    "click .button-oauth": "redirect"
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
      error: function (resp) {
        Slipmat._onError(view, resp.responseJSON);
      }
    });
  },

  demo: function (e) {
    e.preventDefault();
    Slipmat.currentUser.signInAsDemoUser();
  },

  redirect: function (e) {
    e.preventDefault();

    var provider = $(e.currentTarget).attr("id");
    location.replace("/auth/" + provider);
  }

});
