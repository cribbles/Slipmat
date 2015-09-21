Slipmat.Import = {}

Slipmat.Import.import = function (id) {
  var token = Slipmat.discogsUserToken
  $.ajax({
    url: "http://api.discogs.com/releases/" + id,
    type: "GET",
    dataType: "json",
    success: function (payload) {
      Slipmat.Import.parse(payload);
    }
  });
}

Slipmat.Import.parse = function (payload) {
  var record = new Slipmat.Models.Record();
  var artist_name = payload.artists[0].name;

  record.attributes.record = {
    artist_name: artist_name,
    label_name: payload.labels[0].name,
    cat_no: payload.labels[0].catno,
    title: payload.title,
    year: payload.year,
    notes: payload.notes,
    genres: payload.genres,
    tracks_attributes: []
  };

  payload.tracklist.forEach(function (track) {
    var newTrack = {
      duration: track.duration,
      position: track.position,
      title: track.title
    };

    record.attributes.record.tracks_attributes.unshift(newTrack);
  });

  record.save({}, {
    success: function (model) {
      Slipmat.Import.fetchImage(model, artist_name);
    }
  });
}

Slipmat.Import.fetchImage = function (model, artist_name) {
  var recordId = model.id;
  var token = Slipmat.discogsUserToken;
  var escapedTitle = model.get("title").replace(/ /g, "+");
  var url = "https://api.discogs.com/database/search?artist=";

  $.ajax({
    url: url + artist_name + "&title=" + escapedTitle + "&token=" + token,
    type: "GET",
    dataType: "json",
    success: function (payload) {
      Slipmat.Import.patchImage(recordId, payload);
    }
  });
}

Slipmat.Import.patchImage = function (recordId, payload) {
  var newModel = new Slipmat.Models.Record({ id: recordId });

  newModel.attributes.record = {
    image_url: payload.results[0].thumb
  };

  newModel.save({}, {
    success: function () {
      console.log("Fetch successful, URL is /records/" + recordId);
    }
  });
}

Slipmat.import = Slipmat.Import.import;
