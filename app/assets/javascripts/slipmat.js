window.Slipmat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var router, header, footer;

    this.currentUser = new Slipmat.Models.CurrentUser();
    this.currentUser.fetch();

    ["countries", "genres"].forEach(model => {
      $.ajax({
        url: "/api/" + model,
        type: "GET",
        success: (payload) => { Slipmat[model] = payload }
      });
    });

    header = new Slipmat.Views.Header();
    footer = new Slipmat.Views.Footer();
    $("body").prepend(header.render().$el);
    $("body").append(footer.render().$el);

    router = new Slipmat.Routers.Router({
      $rootEl: $("main.content"),
      records: new Slipmat.Collections.Records(),
      artists: new Slipmat.Collections.Artists(),
      labels: new Slipmat.Collections.Labels(),
      spinner: new Spinner().spin().el
    });

    Backbone.history.start();
  }
};

$(document).ready(() => { Slipmat.initialize() });
