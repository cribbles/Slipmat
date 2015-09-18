Slipmat.Models.User = Backbone.Model.extend({

  urlRoot: "/api/users",

  toJSON: function () {
    return { user: _.clone(this.attributes) };
  },

  parse: function (payload) {
    if (payload.collection) {
      this.collectedRecords().set(payload.collection);
      delete payload.collection;
    }
    if (payload.wantlist) {
      this.wantedRecords().set(payload.wantlist);
      delete payload.wantlist;
    }
    if (payload.associations) {
      this._associations = payload.associations;
      delete payload.associations;
    }

    return payload;
  },

  collectedRecords: function () {
    if (!this._collectedRecords) {
      this._collectedRecords = new Slipmat.Collections.Records();
    }

    return this._collectedRecords;
  },

  wantedRecords: function () {
    if (!this._wantedRecords) {
      this._wantedRecords = new Slipmat.Collections.Records();
    }

    return this._wantedRecords;
  },

  associations: function () {
    return _.clone(this._associations);
  },

  addAssociation: function (attributes) {
    this._associations.push(attributes);
  },

  removeAssociation: function (id) {
    var i = this._associations.findIndex(function (assoc) {
      return assoc.id === id
    });

    this._associations.splice(i, 1);
  }

});

Slipmat.Models.CurrentUser = Slipmat.Models.User.extend({

  url: "/api/session",

  initialize: function () {
    this.listenTo(this, "change", this.triggerSessionEvent);
  },

  isSignedIn: function () {
    return !this.isNew();
  },

  signIn: function (options) {
    options = options || {};

    var credentials = {
      "user[username]": options.username,
      "user[password]": options.password
    };

    $.ajax({
      url: this.url,
      type: "POST",
      data: credentials,
      dataType: "json",
      success: function (user) {
        this.set(user);
        options.success && options.success(user);
      }.bind(this),
      error: function () {
        options.error && options.error();
      }
    });
  },

  signOut: function (options) {
    options = options || {};

    $.ajax({
      url: this.url,
      type: "DELETE",
      dataType: "json",
      success: function () {
        this.clear();
        options.success && options.success();
      }.bind(this)
    });
  },

  triggerSessionEvent: function () {
    if (this.isSignedIn()) {
      this.trigger("signIn");
    } else {
      this.trigger("signOut");
    }
  }

});
