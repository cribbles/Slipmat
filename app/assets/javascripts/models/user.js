Slipmat.Models.User = Backbone.Model.extend({

  urlRoot: "/api/users",

  toJSON: function () {
    return { user: _.clone(this.attributes) };
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
