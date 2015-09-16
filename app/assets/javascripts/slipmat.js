window.Slipmat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var header = new Slipmat.Views.Header();
    var footer = new Slipmat.Views.Footer();
    var countries = new Slipmat.Collections.Countries();
    countries.fetch();

    $("body").prepend(header.render().$el);
    $("body").append(footer.render().$el);

    var router = new Slipmat.Routers.Router({
      $rootEl: $("main.content"),
      countries: countries
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  Slipmat.initialize();
});
