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
    var list = this._getListFromType(listType);

    $.ajax({
      url: "/api/user_" + listType + "s",
      type: "POST",
      dataType: "json",
      data: { record_id: record.id },
      success: function (data) {
        var listRecord = record.clone().set({ list_id: data.list_id });
        list.add(listRecord);
        callback && callback();
      }
    });
  },

  removeFromList: function (listType, record, callback) {
    var list = this._getListFromType(listType);
    var id = list.get(record.id).get("list_id");

    $.ajax({
      url: "/api/user_" + listType + "s/" + id,
      type: "DELETE",
      dataType: "json",
      success: function () {
        list.remove(record.id);
        callback && callback();
      }
    });
  },

  _getListFromType: function (listType) {
    if (listType === "collection") {
      return this.collectedRecords();
    } else if (listType === "want") {
      return this.wantedRecords();
    }
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
