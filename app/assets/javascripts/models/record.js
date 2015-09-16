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
  }

});
