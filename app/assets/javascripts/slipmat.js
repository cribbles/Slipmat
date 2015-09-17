window.Slipmat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var header = new Slipmat.Views.Header();
    var footer = new Slipmat.Views.Footer();
    $("body").prepend(header.render().$el);
    $("body").append(footer.render().$el);

    this.currentUser = new Slipmat.Models.CurrentUser();
    this.currentUser.fetch();

    this.countries = new Slipmat.Collections.Countries();
    this.countries.fetch();

    var router = new Slipmat.Routers.Router({
      $rootEl: $("main.content"),
      countries: this.countries
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  Slipmat.initialize();
});
