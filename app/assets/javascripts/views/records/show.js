Slipmat.Views.RecordShow = Backbone.View.extend({

  tagName: "main",
  className: "group",
  template: JST["records/show"],

  initialize: function () {
    this.toggleListButtons();

    this.listenTo(this.model, "sync", this.render);
    this.listenTo(Slipmat.currentUser, "sync", this.toggleListButtons);
  },

  events: {
    "click .list": "toggleList"
  },

  render: function () {
    var content = this.template({ record: this.model });
    this.$el.html(content);
    this.toggleListButtons();

    return this;
  },

  toggleListButtons: function () {
    var $want = this.$("button#want");
    var $collect = this.$("button#collection");

    if (!Slipmat.currentUser.isSignedIn()) {
      this._toggleButton($collect, "add");
      this._toggleButton($want, "add");
      return;
    }

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

    var list;
    var view = this;
    var $el = $(e.currentTarget);
    var listType = $el.attr("id");
    var action = $el.data("action");

    if (listType === "collection") {
      list = new Slipmat.Models.UserCollection();
      collection = Slipmat.currentUser.collectedRecords();
    } else if (listType === "want") {
      list = new Slipmat.Models.UserWant();
      collection = Slipmat.currentUser.wantedRecords();
    } else {
      return;
    }

    if (action === "add") {
      var relationship = {
        user_id: Slipmat.currentUser.id,
        record_id: view.model.id
      };

      list.save(relationship, {
        success: function (association) {
          collection.add(this.model);
          Slipmat.currentUser.addAssociation(association.attributes);
          view._toggleButton($el, "remove");
        }
      });
    } else if (action === "remove") {
      debugger
      var associations = Slipmat.currentUser.associations();
      var id = associations.find(function (assoc) {
        return assoc.record_id === view.model.id && assoc.type === listType;
      }).id;

      $.ajax({
        url: "/api/user_" + listType + "s/" + id,
        type: "DELETE",
        dataType: "json",
        success: function () {
          view._toggleButton($el, "add");
        }
      });

      Slipmat.currentUser.removeAssociation(id);
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
