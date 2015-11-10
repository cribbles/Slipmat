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

    var image = this.$("#image-form")[0].files[0],
        attributes = this.$el.serializeJSON(),
        callback = (model) => {
          Backbone.history.navigate("/records/" + model.id, { trigger: true });
        };

    this.model.save(attributes, {
      success: (model) => {
        if (!image) {
          callback(model);
          return;
        }
        this.submitImage({
          image: image,
          param: "record[image]",
          model: model,
          success: callback.bind(this, model)
        });
      },
      error: (model, resp) => {
        Slipmat._onError(this, resp.responseJSON);
      }
    });
  },

  addCountries: function () {
    var selected,
        template,
        modelCountry = this.model.country(),
        $el = this.$("#record_country");

    Slipmat.countries.forEach((country) => {
      selected = (country.id === modelCountry.id);
      template = JST["records/_formOption"]({
        id: country.id,
        attribute: country.name,
        selected: selected
      });

      $el.append(template);
    });
  },

  addGenres: function () {
    var checked,
        template,
        modelGenres = this.model.genres(),
        $el = this.$(".genre-container");

    Slipmat.genres.forEach((genre) => {
      checked = modelGenres.some((modelGenre) => {
        return genre.id === modelGenre.id;
      });

      template = JST["records/_genreCheckbox"]({
        genre: genre,
        checked: checked
      });

      $el.append(template);
    });
  },

  addTracks: function () {
    var i,
        track,
        content = JST["tracks/form"](),
        numTracks = this.model.tracks().length || 4,
        tracks = _.sortBy(this.model.tracks(), track => track.ord);

    this.$(".tracklist-form").html(content);

    // display all the tracks, or some initial blank fields
    for (i = 0; i < numTracks; i++) {
      track = tracks[i] || {};
      this._addTrack(track);
    }
    this.$(".tracks-container").sortable({ handle: "small" });
  },

  addTrack: function (e) {
    e.preventDefault();
    this._addTrack({});
  },

  _addTrack: function (track) {
    var $el = this.$(".tracks-container"),
        content = JST["tracks/_formItem"]({
          item: this.sort++,
          track: track
        });

    $el.append(content);
  },

  removeTrack: function (e) {
    e.preventDefault();

    var $_destroy,
        $track = $(e.currentTarget).parents(".tracklist-form-track");

    if (this.model.isNew()) {
      $track.remove();
    } else {
      $_destroy = $('<input type="hidden">')
        .attr("name", "record[tracks_attributes][][_destroy]")
        .attr("value", "true");

      $track.hide().append($_destroy);
    }
  },

  updateTracklistOrder: function () {
    var i,
        $input,
        order = this.$(".tracks-container").sortable("toArray");

    for (i = 0; i < order.length; i++) {
      $input = this.$("input.track-ord")[i];
      $($input).val(i + 1);
    }
  }

});
