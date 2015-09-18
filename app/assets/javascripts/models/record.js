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
    if (payload.in_collection) {
      this._inCollection = payload.in_collection;
      delete payload.in_collection;
    }
    if (payload.in_wantlist) {
      this._inWantlist = payload.in_wantlist;
      delete payload.in_wantlist;
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
  },

  inCollection: function () {
    this._inCollection = this._inCollection || [];
    return this._inCollection;
  },

  inWantlist: function () {
    this._inWantlist = this._inWantlist || [];
    return this._inWantlist;
  }

});
