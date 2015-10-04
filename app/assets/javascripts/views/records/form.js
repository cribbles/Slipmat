Slipmat.Views.RecordForm = Backbone.ImageableView.extend({

  tagName: "form",
  id: "record-form",
  template: JST["records/form"],

  initialize: function (options) {
    this.sort = 0;
    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "change #image-form": "replaceFormImage",
    "click #upload": "triggerUpload",
    "click .add-track": "addTrack",
    "click .remove-track": "removeTrack",
    "sortbeforestop .tracks-container": "updateTracklistOrder",
    "submit": "submit"
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);
    this.addCountries();
    this.addGenres();
    this.addTracks();

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var view = this;
    var image = this.$("#image-form")[0].files[0];
    var attributes = this.$el.serializeJSON();
    var callback = function (model) {
      Backbone.history.navigate("/records/" + model.id, { trigger: true });
    }

    this.model.save(attributes, {
      success: function (model) {
        if (!image) {
          callback(model);
          return;
        }
        view.submitImage({
          image: image,
          param: "record[image]",
          model: model,
          success: callback.bind(view, model)
        });
      }
    });
  },

  addCountries: function () {
    var view = this;
    Slipmat.countries.forEach(function (country) {
      var selected = (country.id === view.model.country().id);
      var template = JST["records/_formOption"]({
        id: country.id,
        attribute: country.name,
        selected: selected
      });

      view.$("#record_country").append(template);
    });
  },

  addGenres: function () {
    var view = this;
    Slipmat.genres.forEach(function (genre) {
      var checked = view.model.genres().some(function (modelGenre) {
        return genre.id === modelGenre.id;
      });

      var template = JST["records/_genreCheckbox"]({
        genre: genre,
        checked: checked
      });

      view.$(".genre-container").append(template);
    });
  },

  addTracks: function () {
    var tracks = _.sortBy(this.model.tracks(), function (track) {
      return track.ord;
    });

    var content = JST["tracks/form"]();
    this.$(".tracklist-form").html(content);

    // display all the tracks, or some initial blank fields
    var numTracks = this.model.tracks().length || 4;
    for (var i = 0; i < numTracks; i++) {
      var track = tracks[i] || {};
      this._addTrack(track);
    }

    this.$(".tracks-container").sortable({ handle: "small" });
  },

  addTrack: function (e) {
    e.preventDefault();
    this._addTrack({});
  },

  _addTrack: function (track) {
    var content = JST["tracks/_formItem"]({
      item: this.sort++,
      track: track
    });

    this.$(".tracks-container").append(content);
  },

  removeTrack: function (e) {
    e.preventDefault();

    var $track = $(e.currentTarget).parents(".tracklist-form-track");

    if (this.model.isNew()) {
      $track.remove();
    } else {
      var $_destroy = $('<input type="hidden">')
        .attr("name", "record[tracks_attributes][][_destroy]")
        .attr("value", "true");

      $track.hide();
      $track.append($_destroy);
    }
  },

  updateTracklistOrder: function () {
    var order = this.$(".tracks-container").sortable("toArray");

    for (var i = 0; i < order.length; i++) {
      var input = this.$("input.track-ord")[i];
      $(input).val(i + 1);
    }
  }

});
