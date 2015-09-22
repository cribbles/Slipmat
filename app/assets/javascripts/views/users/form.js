Slipmat.Views.UserNew = Backbone.CompositeView.extend({

  template: JST["users/new"],

  events: {
    "submit #new-user": "submit"
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
        this.$(".form-with-errors").show();
        var $errors = $(".errors").empty();

        resp.responseJSON.forEach(function(error) {
          var $error = $("<li>").text(error);

          $errors.append($error);
        });
      }
    });
  }
});
