Slipmat.Views.RecordIndex = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/index"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function () {
    var content = this.template({ records: this.collection });

    this.$el.html(content);
    this.renderSubviews();

    return this;
  },

  renderSubviews: function () {
    var view = this;
    var recordSubview = JST["records/_record"];
    var header = JST["records/_paginationHeader"]({ records: this.collection });
    this.$(".pagination-header").html(header);

    this.collection.each(function(record) {
      var subview = recordSubview({ record: record });

      view.$(".content-records").append(subview);
    });
  }

});
