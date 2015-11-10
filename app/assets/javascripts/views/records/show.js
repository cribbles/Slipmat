Slipmat.Views.RecordShow = Backbone.ModularView.extend({

  tagName: "main",
  className: "group",
  template: JST["records/show"],

  initialize: function (options) {
    this.router = options.router;
    this.trackTemplate = JST["tracks/_track"];

    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "click .list": "toggleList",
    "submit": "addComment"
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);

    if (Slipmat.currentUser.isSignedIn()) {
      $textarea = $('<textarea class="form comment-form">');
      this.$("#new-comment").prepend($textarea);
    }

    this.renderGenres();
    this.renderTracks();
    this.listContributors();
    this.renderComments();
    this.toggleListButtons();
    return this;
  },

  renderGenres: function () {
    var genre,
        fragment,
        $genre,
        genres = this.model.genres(),
        $genres = this.$("#genres .value");

    if (!genres.length) { return; }

    for (var i = 0; i < genres.length; i++) {
      genre = genres[i].name;
      fragment = "#/records/search?genre=" + window.encodeURIComponent(genre);
      $genre = $('<a href="' + fragment + '">').text(genre);
      $genres.append($genre);
      if (i + 1 < genres.length) { $genres.append(", "); }
    }
  },

  renderTracks: function () {
    var tracks = this.model.tracks();
    if (!tracks.length) { return; }
    tracks.forEach(track => { this._addTrack(track) });
  },

  toggleListButtons: function () {
    if (!Slipmat.currentUser.isSignedIn()) { return; }

    var $want = this.$("button#want"),
        $collect = this.$("button#collection"),
        wantlist = Slipmat.currentUser.wantedRecords(),
        collection = Slipmat.currentUser.collectedRecords(),
        wantAction = (wantlist.hasRecord(this.model) ? "remove" : "add"),
        collectAction = (collection.hasRecord(this.model) ? "remove" : "add");

    this._toggleButton($want, wantAction);
    this._toggleButton($collect, collectAction);
  },

  toggleList: function (e) {
    e.preventDefault();
    if (!this._ensureSignedIn()) { return; }

    var callback,
        $button = $(e.currentTarget),
        list = $button.attr("id"),
        action = $button.data("action"),
        listCount = this.$("#" + list + "Count"),
        count = Number(listCount.text());

    if (action === "add") {
      callback = () => {
        listCount.html(++count);
        this._toggleButton($button, "remove");
      };
      Slipmat.currentUser.addToList(list, this.model, callback);
    } else if (action === "remove") {
      callback = () => {
        listCount.html(--count);
        this._toggleButton($button, "add");
      };
      Slipmat.currentUser.removeFromList(list, this.model, callback);
    }
    $button.prop("disabled", true);
  },

  _toggleButton: function ($button, action) {
    var listType = $button.attr("id"),
        prependText = (action === "add" ? "Add to" : "Remove from"),
        appendText = (listType === "want" ? "Wantlist" : "Collection");

    $button
      .data("action", action)
      .text(prependText + " " + appendText)
      .prop("disabled", false);
  },

  _addTrack: function (track) {
    var content = this.trackTemplate({ track: track });
    this.$(".tracklist-container").append(content);
  }

});
