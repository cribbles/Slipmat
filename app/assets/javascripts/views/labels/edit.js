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
    debugger

    var view = this;
    var image = this.$("#image-form")[0].files[0];
    var attributes = this.$el.serializeJSON();
    var callback = function (label) {
      Slipmat.currentUser.fetch();
      Backbone.history.navigate("#/labels/" + label.id, { trigger: true });
    }

    this.model.save(attributes, {
      success: function (label) {
        if (!image) {
          callback(label);
          return;
        }

        view.submitImage({
          image: image,
          param: "label[image]",
          model: label,
          success: callback.bind(view, label)
        });
      }
    });
  }
});
