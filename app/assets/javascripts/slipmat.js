window.Slipmat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    this.currentUser = new Slipmat.Models.CurrentUser();
    this.currentUser.fetch();
    Slipmat.countries = new Slipmat.Collections.Countries();
    Slipmat.countries.fetch();

    var header = new Slipmat.Views.Header();
    var footer = new Slipmat.Views.Footer();
    $("body").prepend(header.render().$el);
    $("body").append(footer.render().$el);

    var router = new Slipmat.Routers.Router({
      $rootEl: $("main.content")
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  Slipmat.initialize();
});
