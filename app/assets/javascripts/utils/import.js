Slipmat.Import = {}

Slipmat.Import.import = (id) => {
  $.ajax({
    url: "http://api.discogs.com/releases/" + id,
    type: "GET",
    dataType: "json",
    success: (payload) => { Slipmat.Import.parse(payload) }
  });
};

Slipmat.Import.parse = (payload) => {
  var newTrack,
      record = new Slipmat.Models.Record(),
      artist_name = payload.artists[0].name;

  record.attributes.record = {
    artist_name: artist_name,
    label_name: payload.labels[0].name,
    cat_no: payload.labels[0].catno,
    title: payload.title,
    year: payload.year,
    notes: payload.notes,
    genres: payload.genres,
    discogs_id: payload.id,
    tracks_attributes: []
  };

  payload.tracklist.forEach(track => {
    newTrack = {
      duration: track.duration,
      position: track.position,
      title: track.title
    };
    record.attributes.record.tracks_attributes.unshift(newTrack);
  });

  record.save({}, {
    success: (model) => { Slipmat.Import.fetchImage(model, artist_name) }
  });
};

Slipmat.Import.fetchImage = (model, artist_name) => {
  var recordId = model.id,
      token = Slipmat.discogsUserToken,
      escapedTitle = model.get("title").replace(/ /g, "+"),
      url = "https://api.discogs.com/database/search?artist=";
  url += artist_name + "&title=" + escapedTitle + "&token=" + token;

  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: (payload) => { Slipmat.Import.patchImage(recordId, payload) }
  });
};

Slipmat.Import.patchImage = (recordId, payload) => {
  var record = new Slipmat.Models.Record({
    id: recordId,
    record: { image_url: payload.results[0].thumb }
  });

  record.save({}, {
    success: () => { Backbone.history.navigate("//records/" + recordId) }
  });
};

Slipmat.import = Slipmat.Import.import;
