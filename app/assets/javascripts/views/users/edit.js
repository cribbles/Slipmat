Slipmat.Views.UserEdit = Backbone.ImageableView.extend({

  tagName: "form",
  id: "user-form",
  template: JST["users/edit"],

  events: {
    "submit": "submit"
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var $form = $(e.currentTarget);
    var attributes = $form.serializeJSON().user;

    this.model.save(attributes, {
      success: function (user) {
        Slipmat.currentUser.fetch();
        Backbone.history.navigate("#/users/" + user.id, { trigger: true });
      }
    });
  }
});
