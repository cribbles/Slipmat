Slipmat.Views.RecordForm = Backbone.View.extend({

  tagName: "form",
  id: "recordForm",
  template: JST["records/form"],

  initialize: function () {
    this.artists = new Slipmat.Collections.Artists();
    this.labels = new Slipmat.Collections.Labels();
    this.artists.fetch();
    this.labels.fetch();

    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.artists, "sync", this.addArtists);
    this.listenTo(this.labels, "sync", this.addLabels);
  },

  events: {
    "click .new-selector": "replaceInputField",
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
    });
  },

  addArtists: function (artists) {
    artists.forEach(function (artist) {
      var selected = (artist.id === this.model.get("artist_id"));
      var template = JST["records/formOption"]({
        model: artist,
        attribute: "name",
        selected: selected
      });

      this.$("#record_artist").append(template);
    }, this);
  },

  addLabels: function (labels) {
    labels.forEach(function (label) {
      var selected = (label.id === this.model.get("label_id"));
      var template = JST["records/formOption"]({
        model: label,
        attribute: "title",
        selected: selected
      });

      this.$("#record_label").append(template);
    }, this);
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
