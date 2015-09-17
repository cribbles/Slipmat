Slipmat.Views.RecordShow = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "click .add-record": "addToList"
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);

    return this;
  },

  addToList: function (e) {
    e.preventDefault();
    if (!this._ensureSignedIn()) { return; }

    var list, listType = $(e.currentTarget).data("list-type");

    if (listType === "collection") {
      list = new Slipmat.Models.UserCollection();
    } else if (listType === "wantlist") {
      list = new Slipmat.Models.UserWant();
    } else {
      return;
    }

    var relationship = {
      user_id: Slipmat.currentUser.id,
      record_id: this.model.id
    };

    list.save(relationship, {
      success: function (model) {
        console.log(model);
      }
    });
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
