Slipmat.Views.LabelShow = Backbone.ModularView.extend({

  tagName: "main",
  className: "group",
  template: JST["labels/show"],

  initialize: function () {
    this.listenTo(this.model, "sync change", this.render);
  },

  events: {
    "submit": "addComment"
  },

  render: function () {
    var content = this.template({ label: this.model });
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
    var view = this;
    var records = this.model.records();

    var header = JST["layouts/_paginationHeader"]({ collection: records });
    this.$(".pagination-header").html(header);

    var footer = JST["layouts/_paginationFooter"]({ collection: records });
    this.$(".pagination-footer").html(footer);

    records.forEach(function(record) {
      var subview = JST["records/_record"]({ model: record });

      view.$(".content-records").append(subview);
    });
  }

});
