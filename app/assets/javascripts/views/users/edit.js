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

    var fragment,
        view = this,
        image = this.$("#image-form")[0].files[0],
        attributes = this.$el.serializeJSON(),
        callback = function (user) {
          fragment = "//users/" + user.get("slug");
          Slipmat.currentUser.fetch();
          Backbone.history.navigate(fragment, { trigger: true });
        };

    this.model.save(attributes, {
      success: function (user) {
        if (!image) {
          callback(user);
          return;
        }

        view.submitImage({
          image: image,
          param: "user[image]",
          model: user,
          success: callback.bind(view, user)
        });
      },
      error: function (model, resp) {
        Slipmat._onError(this, resp.responseJSON);
      }
    });
  }
});
