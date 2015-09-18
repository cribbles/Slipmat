Slipmat.Models.Record = Backbone.Model.extend({

  urlRoot: "api/records",

  parse: function (payload) {
    if (payload.artist) {
      this.artist().set(payload.artist);
      delete payload.artist;
    }

    if (payload.label) {
      this.label().set(payload.label);
      delete payload.label;
    }

    if (payload.contributors) {
      this._contributors = payload.contributors;
      delete payload.contributors;
    }

    return payload;
  },

  artist: function () {
    if (!this._artist) {
      this._artist = new Slipmat.Models.Artist();
    }

    return this._artist;
  },

  label: function () {
    if (!this._label) {
      this._label = new Slipmat.Models.Label();
    }

    return this._label;
  },

  contributors: function () {
    this._contributors = this._contributors || [];

    return this._contributors;
  }

});
