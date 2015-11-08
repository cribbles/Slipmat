Slipmat.Views.ArtistShow = Backbone.ModularView.extend({

  tagName: "main",
  className: "group",
  template: JST["artists/show"],

  initialize: function (options) {
    this.router = options.router;
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
    this.renderRecords();
    return this;
  },

  renderRecords: function () {
    var subview,
        records = this.model.records(),
        template = JST["records/_record"],
        header = JST["layouts/_paginationHeader"]({ collection: records }),
        footer = JST["layouts/_paginationFooter"]({ collection: records }),
        $el = this.$(".content-records");

    this.$(".pagination-header").html(header);
    this.$(".pagination-footer").html(footer);

    records.forEach(function (record) {
      subview = template({ model: record });
      $el.append(subview);
    });
  }

});
