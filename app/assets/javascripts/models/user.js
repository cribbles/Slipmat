Slipmat.Models.User = Backbone.Model.extend({

  urlRoot: "/api/users",

  toJSON: function () {
    return { user: _.clone(this.attributes) };
  }

});
