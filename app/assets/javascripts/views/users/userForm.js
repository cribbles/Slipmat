Slipmat.Views.UserForm = Backbone.View.extend({

  tagName: "form",
  id: "user-form",
  template: JST["users/form"],

  events: {
    "submit .button-main": "submit"
  },

  render: function () {
    var content = this.template({ user: this.model }),
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var attributes = this.$el.serializeJSON();

    this.model.save(attributes, {
      success: function (user) {
        Backbone.history.navigate("#/users/" + user.id, { trigger: true });
      }
    });
  }
});
