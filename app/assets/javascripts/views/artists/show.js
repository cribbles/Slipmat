Slipmat.Views.ArtistShow = Backbone.ModularView.extend({

  tagName: "main",
  className: "group",
  template: JST["artists/show"],

  initialize: function () {
    this.listenTo(this.model, "sync change", this.render);
  },

  events: {
    "submit": "addComment"
  },

  render: function () {
    var content = this.template({ artist: this.model });
    this.$el.html(content);

    if (Slipmat.currentUser.isSignedIn()) {
      $textarea = $('<textarea class="form comment-form">');
      this.$("#new-comment").prepend($textarea);
    }

    this.listContributors();
    this.renderComments();

    return this;
  }

});
