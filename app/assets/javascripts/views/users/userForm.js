Slipmat.Views.UserForm = Backbone.View.extend({

  template: JST["users/form"],

  events: {
    "submit .new-user": "submit"
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var attributes = this.$(e.currentTarget).serializeJSON();

    this.model.save(attributes, {
      success: function (user) {
        Backbone.history.navigate("#/users/" + user.id, { trigger: true });
      }
    });
  }
});
