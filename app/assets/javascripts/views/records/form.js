Slipmat.Views.RecordForm = Backbone.View.extend({

  tagName: "form",
  id: "record-form",
  template: JST["records/form"],

  initialize: function (options) {
    this.sort = 0;
    this.artists = new Slipmat.Collections.Artists();
    this.labels = new Slipmat.Collections.Labels();
    this.artists.fetch();
    this.labels.fetch();

    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.artists, "sync", this.addArtists);
    this.listenTo(this.labels, "sync", this.addLabels);
    this.listenTo(Slipmat.countries, "sync", this.addCountries);
  },

  events: {
    "click .new-selector": "replaceInputField",
    "sortbeforestop .tracks-container": "updateTracklistOrder",
    "click .add-track": "addTrack",
    "click .remove-track": "removeTrack",
    "submit": "submit"
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);
    this.addCountries();
    this.addTracks();

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var attributes = this.$el.serializeJSON();

    this.model.save(attributes, {
      success: function (model) {
        Backbone.history.navigate("records/" + model.id, { trigger: true });
      }
    });
  },

  addArtists: function (artists) {
    artists.forEach(function (artist) {
      var selected = (artist.id === this.model.artist().id);
      var template = JST["records/_formOption"]({
        model: artist,
        attribute: "name",
        selected: selected
      });

      this.$("#record_artist").append(template);
    }, this);
  },

  addLabels: function (labels) {
    labels.forEach(function (label) {
      var selected = (label.id === this.model.label().id);
      var template = JST["records/_formOption"]({
        model: label,
        attribute: "title",
        selected: selected
      });

      this.$("#record_label").append(template);
    }, this);
  },

  addCountries: function () {
    Slipmat.countries.forEach(function (country) {
      var selected = (country.id === this.model.country().id);
      var template = JST["records/_formOption"]({
        model: country,
        attribute: "name",
        selected: selected
      });

      this.$("#record_country").append(template);
    }, this);
  },

  addTracks: function () {
    var tracks = _.sortBy(this.model.tracks(), function (track) {
      return track.ord;
    });

    var content = JST["tracks/form"]();
    this.$(".tracklist-form").html(content);

    // iterate over all the tracks, or display an initial blank input
    var numTracks = this.model.tracks().length || 1;
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
  },

  replaceInputField: function (e) {
    e.preventDefault();

    var $el = $(e.currentTarget);
    var id = $el.data("id");
    var template = JST["records/_formInput"]({
      id: id,
      name: $el.data("name")
    });

    $el.remove();
    this.$("#" + id).replaceWith(template);
  }

});
