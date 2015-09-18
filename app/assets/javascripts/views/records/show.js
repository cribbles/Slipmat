Slipmat.Views.RecordShow = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/show"],

  initialize: function () {
    this.listenTo(this.model, "sync change", this.render);
    this.listenTo(Slipmat.currentUser, "sync", this.toggleListButtons);
  },

  events: {
    "click .list": "toggleList",
    "submit #new-comment": "addComment"
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);

    if (Slipmat.currentUser.isSignedIn()) {
      $textarea = $('<textarea class="form comment-form">');
      this.$("#new-comment").prepend($textarea);
    }
    this.listContributors();
    this.renderComments();
    this.toggleListButtons();

    return this;
  },

  listContributors: function () {
    var contributors = this.model.contributors();
    if (!contributors.length) { return; }

    var $contributors = this.$(".contributors-container");
    contributors.forEach(function (contributor) {
      var $contributor = $('<a href="#/users/' + contributor.id + '">')
      $contributor.text(_.escape(contributor.username));

      $contributors.append($contributor);
    });
  },

  renderComments: function () {
    var comments = this.model.comments();
    if (!comments.length) { return; }

    var view = this;
    var template = JST["shared/_comment"];
    comments.forEach(function(comment) {
      var content = template({ comment: comment });

      view.$("section.comments").append(content);
    });
  },

  addComment: function (e) {
    e.preventDefault();
    if (!this._ensureSignedIn()) { return; }

    var comment = {
      "comment[author_id]": Slipmat.currentUser.id,
      "comment[body]": this.$(".comment-form").val(),
      "comment[commentable_id]": this.model.id,
      "comment[commentable_type]": "Record"
    };

    $.ajax({
      url: "/api/comments",
      type: "POST",
      dataType: "json",
      data: comment,
      success: function (comment) {
        console.log(comment);
      }
    });
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

  _ensureSignedIn: function (callback) {
    if (!Slipmat.currentUser.isSignedIn()) {
      Backbone.history.navigate("login", { trigger: true });
      this.signIn(callback);

      return false;
    }
    return true;
  }

});
