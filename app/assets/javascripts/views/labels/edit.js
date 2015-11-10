Slipmat.Views.LabelEdit = Backbone.ImageableView.extend({

  tagName: "form",
  id: "user-form",
  template: JST["labels/edit"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "change #image-form": "replaceFormImage",
    "click #upload": "triggerUpload",
    "submit": "submit"
  },

  render: function () {
    var content = this.template({ label: this.model });
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var image = this.$("#image-form")[0].files[0],
        attributes = this.$el.serializeJSON(),
        callback = (label) => {
          Slipmat.currentUser.fetch();
          Backbone.history.navigate("#/labels/" + label.id, { trigger: true });
        };

    this.model.save(attributes, {
      success: (label) => {
        if (!image) {
          callback(label);
          return;
        }
        this.submitImage({
          image: image,
          param: "label[image]",
          model: label,
          success: callback.bind(this, label)
        });
      },
      error: (model, resp) => {
        Slipmat._onError(this, resp.responseJSON);
      }
    });
  }
});
