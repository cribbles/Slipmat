Slipmat.Models.Record = Backbone.Model.extend({

  class: "Record",
  urlRoot: "api/records",

  parse: function (payload) {
    var record = this;

    var associations = [
      "artist",
      "label"
    ];

    var attributes = [
      "image",
      "country",
      "genres",
      "tracks",
      "comments",
      "contributors",
      "in_collection",
      "in_wantlist"
    ];

    associations.forEach(function (association) {
      if (payload[association]) {
        record[association]().set(payload[association]);
        delete payload[association];
      }
    });

    attributes.forEach(function (attribute) {
      if (payload[attribute]) {
        record["_" + attribute] = payload[attribute];
        delete payload[attribute];
      }
    });

    return payload;
  },

  image: function () {
    this._image = this._image || Slipmat.defaultRecordImg;
    return this._image;
  },

  artist: function () {
    this._artist = this._artist || new Slipmat.Models.Artist();
    return this._artist;
  },

  label: function () {
    this._label = this._label || new Slipmat.Models.Label();
    return this._label;
  },

  country: function () {
    this._country = this._country || [];
    return this._country;
  },

  genres: function () {
    this._genres = this._genres || [];
    return this._genres;
  },

  tracks: function () {
    this._tracks = this._tracks || [];
    return this._tracks;
  },

  comments: function () {
    this._comments = this._comments || [];
    return this._comments;
  },

  contributors: function () {
    this._contributors = this._contributors || [];
    return this._contributors;
  },

  inCollection: function () {
    this._in_collection = this._in_collection || [];
    return this._in_collection;
  },

  inWantlist: function () {
    this._in_wantlist = this._in_wantlist || [];
    return this._in_wantlist;
  }

});
