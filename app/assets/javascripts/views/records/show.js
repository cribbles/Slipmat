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
    var genres = this.model.genres();
    if (!genres.length) { return; }

    var $genres = this.$("#genres .value");
    for (var i = 0; i < genres.length; i++) {
      var genre = genres[i].name;
      var genreFragment = window.encodeURIComponent(genre);
      var fragment = "#/records/search?genre=" + genreFragment;
      var $genre = $('<a href="' + fragment + '">').text(genre);
      $genres.append($genre);

      if (i + 1 < genres.length) { $genres.append(", "); }
    }
  },

  renderTracks: function () {
    var view = this;
    var tracks = this.model.tracks();
    if (!tracks.length) { return; }

    tracks.forEach(function (track) {
      view._addTrack(track);
    });
  },

  toggleListButtons: function () {
    if (!Slipmat.currentUser.isSignedIn()) { return; }

    var $want = this.$("button#want");
    var $collect = this.$("button#collection");
    var wantlist = Slipmat.currentUser.wantedRecords();
    var collection = Slipmat.currentUser.collectedRecords();
    var wantAction = (wantlist.hasRecord(this.model) ? "remove" : "add");
    var collectAction = (collection.hasRecord(this.model) ? "remove" : "add");

    this._toggleButton($want, wantAction);
    this._toggleButton($collect, collectAction);
  },

  toggleList: function (e) {
    e.preventDefault();
    if (!this._ensureSignedIn()) { return; }

    var callback;
    var view = this;
    var $button = $(e.currentTarget);
    var list = $button.attr("id");
    var action = $button.data("action");
    var listCount = this.$("#" + list + "Count");
    var count = Number(listCount.text());

    if (action === "add") {
      callback = function () {
        listCount.html(++count);
        view._toggleButton($button, "remove");
      }
      Slipmat.currentUser.addToList(list, view.model, callback);
    } else if (action === "remove") {
      callback = function () {
        listCount.html(--count);
        view._toggleButton($button, "add");
      }
      Slipmat.currentUser.removeFromList(list, view.model, callback);
    }
    $button.prop("disabled", true);
  },

  _toggleButton: function ($button, action) {
    var listType = $button.attr("id");
    var prependText = (action === "add" ? "Add to" : "Remove from");
    var appendText = (listType === "want" ? "Wantlist" : "Collection");

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
