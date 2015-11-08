Slipmat.Views.ArtistEdit = Backbone.ImageableView.extend({

  tagName: "form",
  id: "user-form",
  template: JST["artists/edit"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "change #image-form": "replaceFormImage",
    "click #upload": "triggerUpload",
    "submit": "submit"
  },

  render: function () {
    var content = this.template({ artist: this.model });
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var view = this,
        image = this.$("#image-form")[0].files[0],
        attributes = this.$el.serializeJSON(),
        callback = function (artist) {
          Slipmat.currentUser.fetch();
          Backbone.history.navigate("#/artists/" + artist.id, { trigger: true });
        };

    this.model.save(attributes, {
      success: function (artist) {
        if (!image) {
          callback(artist);
          return;
        }

        view.submitImage({
          image: image,
          param: "artist[image]",
          model: artist,
          success: callback.bind(view, artist)
        });
      },
      error: function (model, resp) {
        Slipmat._onError(this, resp.responseJSON);
      }
    });
  }
});
