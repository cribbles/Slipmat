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
    this.fragment = "/" + this.proto.toLowerCase() + "s/" + payload.id;
    this.heading = (this.proto === "Artist" ? payload.name : payload.title);
    this.subtitle = (this.proto === "Record" ? this._artist.name : this.proto);

    return payload;
  },

  image: function () {
    return this._image;
  },

  artist: function () {
    var name = _.escape(this._artist.name);
    var artist = {
      id: this._artist.id,
      escape: function () { return name; }
    }
    return artist;
  }

});
