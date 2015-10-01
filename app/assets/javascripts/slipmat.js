window.Slipmat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
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
    $("body").prepend(header.render().$el);
    var footer = new Slipmat.Views.Footer();
    $("body").append(footer.render().$el);

    var $rootEl = $("main.content");
    var spinner = new Spinner().spin().el;
    $rootEl.html(spinner);

    var router = new Slipmat.Routers.Router({
      $rootEl: $rootEl,
      records: new Slipmat.Collections.Records(),
      artists: new Slipmat.Collections.Artists(),
      labels: new Slipmat.Collections.Labels()
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  Slipmat.initialize();
});
