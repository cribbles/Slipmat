Slipmat.Views.RecordForm = Backbone.View.extend({

  tagName: "form",
  id: "recordForm",
  template: JST["records/form"],

  events: {
    "click .new-selector": "replaceInputField",
    "submit": "submit"
  },

  render: function () {
    var view = this;
    var artists = new Slipmat.Collections.Artists();
    var labels = new Slipmat.Collections.Labels();

    artists.fetch({ success: function (artists) {
      labels.fetch({ success: function (labels) {
        view._render({
          artists: artists,
          labels: labels,
          record: view.model
        });
      }});
    }});

    return this;
  },

  _render: function (options) {
    var content = this.template(options);
    this.$el.html(content);
  },

  submit: function (e) {
    e.preventDefault();

    var attributes = this.$el.serializeJSON();

    this.model.save(attributes, {
      success: function (model) {
        Backbone.history.navigate("records/" + model.id, { trigger: true });
      }
    });
  },

  replaceInputField: function (e) {
    e.preventDefault();

    var $el = $(e.currentTarget);
    var id = $el.data("id");
    var template = JST["records/formInput"]({
      id: id,
      name: $el.data("name")
    });

    $el.remove();
    this.$("#" + id).replaceWith(template);
  }

});
