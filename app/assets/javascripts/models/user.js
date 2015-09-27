Slipmat.Models.User = Backbone.Model.extend({

  urlRoot: "/api/users",

  toJSON: function () {
    return { user: _.clone(this.attributes) };
  },

  parse: function (payload) {
    var user = this;

    if (payload.collection) {
      this.collectedRecords().set(payload.collection, { parse: true });
      delete payload.collection;
    }
    if (payload.wantlist) {
      this.wantedRecords().set(payload.wantlist, { parse: true });
      delete payload.wantlist;
    }
    if (payload.image) {
      this._image = payload.image;
      delete payload.image;
    }
    if (payload.associations) {
      this._associations = payload.associations;
      delete payload.associations;
    }
    if (payload.num_comments) {
      this._num_comments = payload.num_comments;
      delete payload.num_comments;
    }
    if (payload.num_contributions) {
      this._num_contributions = payload.num_contributions;
      delete payload.num_contributions;
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

  image: function () {
    if (!this._image) {
      this._image = Slipmat.defaultUserImg;
    }
    return this._image;
  },

  associations: function () {
    this._associations = this._associations || [];

    return this._associations;
  },

  numComments: function () {
    return this._num_comments || 0;
  },

  numContributions: function () {
    return this._num_contributions || 0;
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
    options.success = options.success || this._signInCallback;

    var credentials = {
      "user[username]": options.username,
      "user[password]": options.password
    };

    $.ajax({
      url: this.url,
      type: "POST",
      data: credentials,
      dataType: "json",
      success: function (attributes) {
        var parsed = this.parse(attributes);
        this.set(parsed);
        options.success && options.success(attributes);
      }.bind(this),
      error: function (resp) {
        options.error && options.error(resp);
      }
    });
  },

  signInAsDemoUser: function () {
    this.signIn({
      username: "Sennacy",
      password: "password"
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
  },

  addToList: function (listType, record, callback) {
    var list, collection;
    var associations = this.associations();
    var relationship = {
      user_id: this.id,
      record_id: record.id
    }

    if (listType === "collection") {
      list = new Slipmat.Models.UserCollection();
      collection = this.collectedRecords();
    } else if (listType === "want") {
      list = new Slipmat.Models.UserWant();
      collection = this.wantedRecords();
    }

    list.save(relationship, {
      success: function (data) {
        var association = data.attributes;

        collection.add(record);
        associations.push(association);
        callback && callback();
      }
    });
  },

  removeFromList: function (listType, record, callback) {
    var id = this.associations().find(function (assoc) {
      return assoc.record_id === record.id && assoc.type === listType;
    }).id;

    var index = this.associations().findIndex(function (assoc) {
      return assoc.id === id
    });
    this._associations.splice(index, 1);

    $.ajax({
      url: "/api/user_" + listType + "s/" + id,
      type: "DELETE",
      dataType: "json",
      success: function () {
        callback && callback();
      }
    });
  },

  _signInCallback: function () {
    var fragment;
    if (Backbone.history.fragment === "login") {
      fragment = "";
    } else {
      fragment = Backbone.history.fragment;
      Backbone.history.fragment = null;
    }
    Backbone.history.navigate(fragment, { trigger: true });
  }

});
