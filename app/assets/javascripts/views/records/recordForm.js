Slipmat.Views.RecordForm = Backbone.View.extend({

  tagName: "form",
  id: "recordForm",
  template: JST["records/form"],

  events: {
    "submit": "submit"
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);

    return this;
  },

  submit: function (e) {
    e.preventDefault();

    var attributes = this.$el.serializeJSON();
    this.model.save(attributes, {
      success: function (model) {
        Backbone.history.navigate("records/" + model.id, { trigger: true });
      }
    })
  }

});
