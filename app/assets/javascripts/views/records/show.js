Slipmat.Views.RecordShow = Backbone.ModularView.extend({

  tagName: "main",
  className: "group",
  template: JST["records/show"],

  initialize: function () {
    this.trackTemplate = JST["tracks/_track"];

    this.listenTo(this.model, "sync change", this.render);
    this.listenTo(Slipmat.currentUser, "sync", this.toggleListButtons);
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
      var genre = genres[i].name
      var fragment = "#/records/search?genre=" + genre
      var $genre = $('<a href="' + fragment + '">').text(genre);
      $genres.append($genre);

      if (i + 1 < genres.length) { $genres.append(", "); }
    }
  },

  renderTracks: function () {
    var tracks = this.model.tracks();
    if (!tracks.length) { return; }

    tracks.forEach(function (track) {
      this._addTrack(track);
    }, this);
  },

  toggleListButtons: function () {
    if (!Slipmat.currentUser.isSignedIn()) { return; }

    var $want = this.$("button#want");
    var $collect = this.$("button#collection");
    var wantlist = Slipmat.currentUser.wantedRecords();
    var collection = Slipmat.currentUser.collectedRecords();

    if (collection && collection.hasRecord(this.model)) {
      this._toggleButton($collect, "remove");
    } else {
      this._toggleButton($collect, "add");
    }

    if (wantlist && wantlist.hasRecord(this.model)) {
      this._toggleButton($want, "remove");
    } else {
      this._toggleButton($want, "add");
    }
  },

  toggleList: function (e) {
    e.preventDefault();
    if (!this._ensureSignedIn()) { return; }

    var view = this;
    var $el = $(e.currentTarget);
    var list = $el.attr("id");
    var listCount = this.$("#" + list + "Count");
    var action = $el.data("action");

    if (action === "add") {
      var callback = function () {
        var newCount = Number(listCount.text()) + 1;
        listCount.html(newCount);

        view._toggleButton($el, "remove");
      }
      Slipmat.currentUser.addToList(list, view.model, callback);
    } else if (action === "remove") {
      var callback = function () {
        var newCount = Number(listCount.text()) - 1;
        listCount.html(newCount);

        view._toggleButton($el, "add");
      }
      Slipmat.currentUser.removeFromList(list, view.model, callback);
    }
  },

  _toggleButton: function ($button, action) {
    $button.data("action", action);

    var listType = $button.attr("id");
    var prependText = (action === "add" ? "Add to " : "Remove from ");

    if (listType === "collection") {
      $button.text(prependText + "Collection");
    } else if (listType === "want") {
      $button.text(prependText + "Wantlist");
    }
  },

  _addTrack: function (track) {
    var content = this.trackTemplate({ track: track });

    this.$(".tracklist-container").append(content);
  }

});
