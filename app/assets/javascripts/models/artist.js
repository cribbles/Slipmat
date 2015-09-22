Slipmat.Models.Artist = Backbone.Model.extend({

  class: "Artist",
  urlRoot: "api/artists",

  parse: function (payload) {
    var artist = this;

    if (payload.records) {
      this.records().set(payload.records, { parse: true });
      delete payload.records;
    }
    if (payload.contributors) {
      this._contributors = payload.contributors;
      delete payload.contributors;
    }
    if (payload.comments) {
      this._comments = payload.comments;
      delete payload.comments;
    }
    if (payload.image) {
      this._image = payload.image;
      delete payload.image;
    }

    return payload;
  },

  records: function () {
    this._records = this._records || new Slipmat.Collections.Records();
    return this._records;
  },

  contributors: function () {
    this._contributors = this._contributors || [];
    return this._contributors;
  },

  comments: function () {
    this._comments = this._comments || [];
    return this._comments;
  },

  image: function () {
    this._image = this._image || Slipmat.defaultArtistImg;
    return this._image;
  }

});
