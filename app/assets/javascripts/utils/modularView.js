Backbone.ModularView = Backbone.View.extend({

  listContributors: function () {
    var contributors = this.model.contributors();
    if (!contributors.length) { return; }

    var $contributors = this.$(".contributors-container");
    contributors.forEach(function (contributor) {
      var $contributor = $('<a href="#/users/' + contributor.slug + '">');
      $contributor.text(_.escape(contributor.username));

      $contributors.append($contributor);
    });
  },

  renderComments: function () {
    var comments = this.model.comments();
    if (!comments.length) { return; }

    comments.forEach(function (comment) {
      this._addComment(comment);
    }, this);
  },

  addComment: function (e) {
    e.preventDefault();
    if (!this._ensureSignedIn()) { return; }

    var comment = {
      "comment[author_id]": Slipmat.currentUser.id,
      "comment[body]": this.$(".comment-form").val(),
      "comment[commentable_id]": this.model.id,
      "comment[commentable_type]": this.model.proto
    };

    $.ajax({
      url: "/api/comments",
      type: "POST",
      dataType: "json",
      data: comment,
      success: function (comment) {
        this.$(".comment-form").val("");
        this._addComment(comment);
      }.bind(this)
    });
  },

  _addComment: function (comment) {
    var commentTemplate = JST["shared/_comment"];
    var content = commentTemplate({ comment: comment });

    this.$(".comments-container").prepend(content);
  },

  _ensureSignedIn: function (callback) {
    if (!Slipmat.currentUser.isSignedIn()) {
      Backbone.history.navigate("/login", { trigger: true });
      this.signIn(callback);

      return false;
    }
    return true;
  }

});
