Slipmat.Models.SearchResult = Backbone.Model.extend({

  url: "/api/search",

  parse: function (payload) {
    if (payload.artist) {
      this._artist = payload.artist;
      delete payload.artist;
    }

    this._image = payload.image;
    delete payload.image;

    this.proto = payload.searchable_type;
    delete payload.searchable_type;

    this.subview = Slipmat.Models[this.proto].prototype.subview;

    return payload;
  },

  artist: function () {
    var name = _.escape(this._artist.name);
    var artist = {
      id: this._artist.id,
      escape: function () { return name; }
    }

    return artist;
  },

  image: function () { return this._image; }

});
