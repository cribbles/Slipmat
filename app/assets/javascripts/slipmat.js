window.Slipmat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    this.records = new Slipmat.Collections.Records();
    this.currentUser = new Slipmat.Models.CurrentUser();
    this.currentUser.fetch();

    ["countries", "genres"].forEach(function (model) {
      $.ajax({
        url: "/api/" + model,
        type: "GET",
        success: function (payload) {
          Slipmat[model] = payload;
        }
      });
    });

    var header = new Slipmat.Views.Header();
    var footer = new Slipmat.Views.Footer();
    $("body").prepend(header.render().$el);
    $("body").append(footer.render().$el);

    var router = new Slipmat.Routers.Router({
      $rootEl: $("main.content"),
      records: this.records
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  Slipmat.initialize();
});
