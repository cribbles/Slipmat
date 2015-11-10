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

    var $form = $(e.currentTarget),
        credentials = $form.serializeJSON();

    Slipmat.currentUser.signIn({
      username: credentials.username,
      password: credentials.password,
      error: (resp) => { Slipmat._onError(this, resp.responseJSON); }
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
