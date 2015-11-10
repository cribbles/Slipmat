Slipmat.Models.Record = Backbone.Model.extend({

  proto: "Record",
  urlRoot: "api/records",
  subview: JST["records/_record"],

  parse: function (payload) {
    var associations = [
          "artist",
          "label"
        ],
        attributes = [
          "image",
          "country",
          "genres",
          "tracks",
          "comments",
          "contributors",
          "num_collected",
          "num_wanted"
        ];

    associations.forEach(association => {
      if (payload[association]) {
        this[association]().set(payload[association]);
        delete payload[association];
      }
    });

    attributes.forEach(attribute => {
      if (payload[attribute]) {
        this["_" + attribute] = payload[attribute];
        delete payload[attribute];
      }
    });

    return payload;
  },

  save: function (key, val, options) {
    var year;

    if (key.record && key.record.year) {
      year = Number(key.record.year);
      if (!year) {
        delete key.record.year;
      } else {
        key.record.year = year;
      }
    }
    return Backbone.Model.prototype.save.call(this, key, val, options);
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

  numCollected: function () {
    this._num_collected = this._num_collected || 0;
    return this._num_collected;
  },

  numWanted: function () {
    this._num_wanted = this._num_wanted || 0;
    return this._num_wanted;
  }

});
