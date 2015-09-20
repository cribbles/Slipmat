Slipmat.Views.UserEdit = Backbone.ImageableView.extend({

  tagName: "form",
  id: "user-form",
  template: JST["users/edit"],

  events: {
    "change #image-form": "replaceFormImage",
    "click #upload": "triggerUpload",
    "submit": "submit"
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var view = this;
    var image = this.$("#image-form")[0].files[0];
    var attributes = this.$el.serializeJSON();

    this.model.save(attributes, {
      success: function (user) {
        view.submitImage({
          image: image,
          param: "user[image]",
          model: view.model
        });

        Backbone.history.navigate("#/users/" + user.id, { trigger: true });
      }
    });
  }
});
